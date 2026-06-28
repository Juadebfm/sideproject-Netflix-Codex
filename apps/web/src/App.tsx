import { startTransition, useEffect, useState } from 'react'

import './App.css'
import {
  buildNetflixGenreUrl,
  fetchCategory,
  fetchRecommendations,
  getReasonLabel,
  getSessionId,
  searchCategories,
  trackAnalyticsEvent,
  type CanonicalCategory,
  type RecommendationCard,
} from './lib/api'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [moodInput, setMoodInput] = useState('')
  const [regionInput, setRegionInput] = useState('')
  const [groupFriendly, setGroupFriendly] = useState(false)
  const [categories, setCategories] = useState<CanonicalCategory[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CanonicalCategory | null>(null)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Ready to find something better.')

  useEffect(() => {
    const sessionId = getSessionId()

    void trackAnalyticsEvent({
      name: 'page_view',
      sessionId,
      metadata: {
        surface: 'home',
      },
    })

    void refreshRecommendations({
      mood: '',
      region: '',
      groupFriendly: false,
    })

    void runSearch('')
  }, [])

  async function runSearch(query: string) {
    setIsLoadingSearch(true)

    const results = await searchCategories(query)

    startTransition(() => {
      setCategories(results)
      setSelectedCategory(results[0] ?? null)
      setIsLoadingSearch(false)
      setStatusMessage(
        results.length > 0
          ? `Found ${results.length} category options.`
          : 'No category matches yet. Try a different mood or genre.',
      )
    })
  }

  async function refreshRecommendations(input: {
    mood: string
    region: string
    groupFriendly: boolean
  }) {
    setIsLoadingRecommendations(true)

    const nextRecommendations = await fetchRecommendations(input)

    startTransition(() => {
      setRecommendations(nextRecommendations)
      setIsLoadingRecommendations(false)
    })
  }

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const sessionId = getSessionId()
    const trimmedQuery = searchInput.trim()

    void trackAnalyticsEvent({
      name: 'search_submitted',
      sessionId,
      metadata: {
        query: trimmedQuery || 'all',
      },
    })

    await runSearch(trimmedQuery)
  }

  async function handleRecommendationRefresh() {
    await refreshRecommendations({
      mood: moodInput,
      region: regionInput,
      groupFriendly,
    })
  }

  async function handleSelectCategory(code: string) {
    const nextCategory = await fetchCategory(code)

    if (nextCategory) {
      setSelectedCategory(nextCategory)
    }

    void trackAnalyticsEvent({
      name: 'recommendation_selected',
      sessionId: getSessionId(),
      metadata: {
        code,
      },
    })
  }

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setStatusMessage(`Copied Netflix code ${code}.`)

      void trackAnalyticsEvent({
        name: 'code_copied',
        sessionId: getSessionId(),
        metadata: {
          code,
        },
      })
    } catch {
      setStatusMessage(`Copy failed for code ${code}.`)
    }
  }

  function handleOpenNetflix(code: string) {
    window.open(buildNetflixGenreUrl(code), '_blank', 'noopener,noreferrer')
    setStatusMessage(`Opened Netflix genre ${code} in a new tab.`)

    void trackAnalyticsEvent({
      name: 'open_in_netflix_clicked',
      sessionId: getSessionId(),
      metadata: {
        code,
      },
    })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="eyebrow">Netflix discovery without the dead-end scroll</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Find the right Netflix movie faster.</h1>
            <p>
              Search smarter categories, grab the exact Netflix code, and jump
              straight into the part of Netflix that actually fits the night.
            </p>
            <form className="search-panel" onSubmit={handleSearchSubmit}>
              <label className="field">
                <span>Search by mood, genre, or intent</span>
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Try thriller, family, anime, hidden gem..."
                />
              </label>
              <div className="search-row">
                <button type="submit" className="cta-primary">
                  {isLoadingSearch ? 'Searching...' : 'Search categories'}
                </button>
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => {
                    setSearchInput('')
                    void runSearch('')
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="signal-grid" aria-label="What Netflix Codex helps with">
            <article className="signal-card signal-card--emphasis">
              <span>Quick win</span>
              <strong>Copy the code</strong>
              <p>Paste it into Netflix or jump directly into the matching genre page.</p>
              <code>Copy + open flow</code>
            </article>
            <article className="signal-card">
              <span>Trust layer</span>
              <strong>Curated recommendations</strong>
              <p>Use editorial and rule-based picks instead of endless homepage loops.</p>
              <code>Search + recommendations</code>
            </article>
            <article className="signal-card">
              <span>Group mode</span>
              <strong>Safer yes-options</strong>
              <p>Bias toward categories that are easier to agree on for shared watching.</p>
              <code>Group-friendly toggle</code>
            </article>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="workspace-grid">
          <section className="panel panel--filters">
            <div className="panel-header">
              <h2>Recommendation inputs</h2>
              <p>Shape the next set of suggestions before you head back to Netflix.</p>
            </div>
            <div className="stack">
              <label className="field">
                <span>Mood</span>
                <input
                  value={moodInput}
                  onChange={(event) => setMoodInput(event.target.value)}
                  placeholder="tense, cozy, funny, action..."
                />
              </label>
              <label className="field">
                <span>Region</span>
                <input
                  value={regionInput}
                  onChange={(event) => setRegionInput(event.target.value)}
                  placeholder="US, UK, NG..."
                />
              </label>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={groupFriendly}
                  onChange={(event) => setGroupFriendly(event.target.checked)}
                />
                <span>Prefer group-friendly suggestions</span>
              </label>
              <button
                type="button"
                className="cta-primary"
                onClick={() => {
                  void handleRecommendationRefresh()
                }}
              >
                {isLoadingRecommendations ? 'Refreshing...' : 'Refresh picks'}
              </button>
            </div>
          </section>

          <section className="panel panel--results">
            <div className="panel-header">
              <h2>Category matches</h2>
              <p>Choose a category to inspect its code and decide faster.</p>
            </div>
            <div className="card-grid">
              {categories.map((category) => {
                const isSelected = selectedCategory?.netflixCode === category.netflixCode

                return (
                  <article
                    key={category.netflixCode}
                    className={`result-card${isSelected ? ' result-card--selected' : ''}`}
                  >
                    <button
                      type="button"
                      className="result-card__body"
                      onClick={() => {
                        void handleSelectCategory(category.netflixCode)
                      }}
                    >
                      <div className="result-card__meta">
                        <span className="pill">Code {category.netflixCode}</span>
                        <span className="pill pill--muted">{category.slug}</span>
                      </div>
                      <h3>{category.title}</h3>
                      <p>{category.summary}</p>
                      <ul className="tag-list">
                        {category.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </button>
                    <div className="result-card__actions">
                      <button
                        type="button"
                        className="mini-button"
                        onClick={() => {
                          void handleCopyCode(category.netflixCode)
                        }}
                      >
                        Copy code
                      </button>
                      <button
                        type="button"
                        className="mini-button mini-button--ghost"
                        onClick={() => handleOpenNetflix(category.netflixCode)}
                      >
                        Open Netflix
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="workspace workspace--secondary">
        <div className="workspace-grid workspace-grid--secondary">
          <section className="panel panel--focus">
            <div className="panel-header">
              <h2>Selected category</h2>
              <p>Use this as the fast path when you already know the right lane.</p>
            </div>
            {selectedCategory ? (
              <div className="focus-card">
                <div className="focus-card__top">
                  <div>
                    <span className="pill">Netflix code</span>
                    <h3>{selectedCategory.title}</h3>
                  </div>
                  <code>{selectedCategory.netflixCode}</code>
                </div>
                <p>{selectedCategory.summary}</p>
                <ul className="tag-list">
                  {selectedCategory.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="cta-row">
                  <button
                    type="button"
                    className="cta-primary"
                    onClick={() => {
                      void handleCopyCode(selectedCategory.netflixCode)
                    }}
                  >
                    Copy {selectedCategory.netflixCode}
                  </button>
                  <button
                    type="button"
                    className="cta-secondary"
                    onClick={() => handleOpenNetflix(selectedCategory.netflixCode)}
                  >
                    Open in Netflix
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">Pick a category to inspect its code.</div>
            )}
          </section>

          <section className="panel panel--recommendations">
            <div className="panel-header">
              <h2>Recommendation feed</h2>
              <p>Start here if you want a stronger first nudge than Netflix usually gives.</p>
            </div>
            <div className="recommendation-list">
              {recommendations.map((recommendation) => (
                <article key={recommendation.title} className="recommendation-card">
                  <div className="recommendation-card__meta">
                    <span className="pill">{getReasonLabel(recommendation.reason)}</span>
                    <span className="pill pill--muted">
                      {recommendation.confidenceLabel} confidence
                    </span>
                  </div>
                  <h3>{recommendation.title}</h3>
                  <p>Netflix code {recommendation.categoryCode}</p>
                  <div className="result-card__actions">
                    <button
                      type="button"
                      className="mini-button"
                      onClick={() => {
                        void handleCopyCode(recommendation.categoryCode)
                      }}
                    >
                      Copy code
                    </button>
                    <button
                      type="button"
                      className="mini-button mini-button--ghost"
                      onClick={() => handleOpenNetflix(recommendation.categoryCode)}
                    >
                      Open Netflix
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <p className="status-banner" aria-live="polite">
        {statusMessage}
      </p>
      <section className="foundation-strip">
        <h2>What PR 5 adds</h2>
        <ul>
          <li>Search-backed category discovery</li>
          <li>Recommendation feed with filters</li>
          <li>Copy and direct-open Netflix actions</li>
          <li>Best-effort analytics wiring</li>
        </ul>
      </section>
    </main>
  )
}

export default App
