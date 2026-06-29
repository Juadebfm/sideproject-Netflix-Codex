import {
  startTransition,
  useEffect,
  useRef,
  useState,
} from 'react'

import './App.css'
import {
  buildNetflixGenreUrl,
  getRegionLabel,
  getVerificationLabel,
  searchCategories,
  toUserMessage,
  type CanonicalCategory,
} from './lib/api'

const INITIAL_VISIBLE_COUNT = 24
const SEARCH_DEBOUNCE_MS = 260

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [categories, setCategories] = useState<CanonicalCategory[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [statusMessage, setStatusMessage] = useState('Loading category codes.')
  const resultsScrollerRef = useRef<HTMLDivElement | null>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)
  const latestSearchRequestRef = useRef(0)

  const visibleCategories = categories.slice(0, visibleCount)
  const hasMoreResults = visibleCount < categories.length

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void runSearch(searchInput.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  useEffect(() => {
    if (!copiedCode) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedCode(null)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [copiedCode])

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current
    const scroller = resultsScrollerRef.current

    if (!trigger || !scroller || !hasMoreResults) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const targetEntry = entries[0]

        if (targetEntry?.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + INITIAL_VISIBLE_COUNT, categories.length),
          )
        }
      },
      {
        root: scroller,
        rootMargin: '0px 0px 180px 0px',
        threshold: 0.1,
      },
    )

    observer.observe(trigger)

    return () => {
      observer.disconnect()
    }
  }, [categories.length, hasMoreResults])

  async function runSearch(query: string) {
    const requestId = latestSearchRequestRef.current + 1
    latestSearchRequestRef.current = requestId

    setIsLoadingSearch(true)
    setSearchError(null)

    try {
      const results = await searchCategories(query, 500)

      if (requestId !== latestSearchRequestRef.current) {
        return
      }

      startTransition(() => {
        setCategories(results)
        setVisibleCount(INITIAL_VISIBLE_COUNT)
        setStatusMessage(
          results.length > 0
            ? `Showing ${results.length} category codes.`
            : 'No category codes matched that search.',
        )
        resultsScrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      })
    } catch (error) {
      if (requestId !== latestSearchRequestRef.current) {
        return
      }

      const message = toUserMessage(error, 'Could not load category codes right now.')

      startTransition(() => {
        setCategories([])
        setVisibleCount(INITIAL_VISIBLE_COUNT)
        setSearchError(message)
        setStatusMessage(message)
      })
    } finally {
      if (requestId !== latestSearchRequestRef.current) {
        return
      }

      startTransition(() => {
        setIsLoadingSearch(false)
      })
    }
  }

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = searchInput.trim()

    await runSearch(trimmedQuery)
  }

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setStatusMessage(`Copied Netflix code ${code}.`)
    } catch {
      setCopiedCode(null)
      setStatusMessage(`Copy failed for code ${code}.`)
    }
  }

  function handleOpenNetflix(code: string) {
    window.open(buildNetflixGenreUrl(code), '_blank', 'noopener,noreferrer')
    setStatusMessage(`Opened Netflix category ${code}.`)
  }

  return (
    <main className="app-shell">
      <section className="catalog-shell">
        <header className="catalog-header">
          <h1>Search categories. Copy the code. Open Netflix.</h1>
          <p className="catalog-intro">
            Search by title, genre, or keyword and jump straight to the right Netflix category code.
          </p>
        </header>

        <section className="search-panel" aria-label="Search category codes">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <label className="search-field">
              <span>Search categories</span>
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Action, anime, family, thriller..."
                aria-describedby="search-helper"
              />
            </label>
            <p id="search-helper" className="search-helper">
              Results update automatically while you type.
            </p>
            <div className="search-actions">
              <button type="submit" className="primary-button">
                {isLoadingSearch ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearchInput('')
                  void runSearch('')
                }}
              >
                Show all
              </button>
            </div>
          </form>
        </section>

        <section className="results-panel" aria-label="Category code results">
          <div className="results-header">
            <h2>Category list</h2>
            <p>{categories.length} results</p>
          </div>

          {searchError ? (
            <div className="message-card message-card--error" role="alert">
              {searchError}
            </div>
          ) : null}

          <div
            className="results-scroller"
            ref={resultsScrollerRef}
            tabIndex={0}
            aria-label="Scrollable category results"
          >
            {!searchError && categories.length === 0 && !isLoadingSearch ? (
              <div className="message-card">No categories found.</div>
            ) : null}

            <ul className="category-list">
              {visibleCategories.map((category) => {
                const isCopied = copiedCode === category.netflixCode
                const sourceSummary =
                  category.sourceCount > 1
                    ? `${category.titleSourceLabel} title · cross-checked by ${category.sourceCount} sources`
                    : `Source: ${category.titleSourceLabel}`

                return (
                  <li key={category.netflixCode} className="category-row">
                    <div className="category-main">
                      <div className="category-code">{category.netflixCode}</div>
                      <div className="category-copy">
                        <h3>{category.title}</h3>
                        <div className="category-meta">
                          <span>{getVerificationLabel(category.verificationState)}</span>
                          <span>{sourceSummary}</span>
                          {category.regions.length > 0 ? (
                            <span>{getRegionLabel(category.regions)}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="category-actions">
                      <button
                        type="button"
                        className={isCopied ? 'secondary-button secondary-button--success' : 'secondary-button'}
                        onClick={() => {
                          void handleCopyCode(category.netflixCode)
                        }}
                        aria-label={
                          isCopied
                            ? `Copied Netflix code ${category.netflixCode}`
                            : `Copy Netflix code ${category.netflixCode}`
                        }
                      >
                        {isCopied ? 'Copied' : 'Copy code'}
                      </button>
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => {
                          handleOpenNetflix(category.netflixCode)
                        }}
                      >
                        Open Netflix
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            {hasMoreResults ? (
              <div className="load-more-zone">
                <div ref={loadMoreTriggerRef} className="load-more-trigger" aria-hidden="true" />
                <button
                  type="button"
                  className="secondary-button load-more-button"
                  onClick={() => {
                    setVisibleCount((currentCount) =>
                      Math.min(currentCount + INITIAL_VISIBLE_COUNT, categories.length),
                    )
                  }}
                >
                  Load more
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <p className="status-banner" aria-live="polite">
          {statusMessage}
        </p>
      </section>
    </main>
  )
}

export default App
