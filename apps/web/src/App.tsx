import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="eyebrow">PR 1 foundation in progress</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Find the right Netflix movie faster.</h1>
            <p>
              Netflix Codex is being scaffolded as a mobile-first discovery app
              for curated codes, stronger recommendations, and quick jump-offs
              into Netflix.
            </p>
            <div className="cta-row">
              <button type="button" className="cta-primary">
                React app ready
              </button>
              <button type="button" className="cta-secondary">
                API foundation ready
              </button>
            </div>
          </div>

          <div className="signal-grid" aria-label="Foundation status">
            <article className="signal-card">
              <span>Frontend</span>
              <strong>React + Vite</strong>
              <p>Mobile-first workspace ready for real feature work.</p>
              <code>apps/web</code>
            </article>
            <article className="signal-card">
              <span>Backend</span>
              <strong>Vercel Functions</strong>
              <p>Separate API app ready for health checks and shared modules.</p>
              <code>apps/api</code>
            </article>
            <article className="signal-card">
              <span>Shared</span>
              <strong>TypeScript base</strong>
              <p>Workspace-level config keeps frontend and backend aligned.</p>
              <code>tsconfig.base.json</code>
            </article>
          </div>
        </div>
      </section>

      <section className="foundation-strip">
        <h2>What PR 1 sets up</h2>
        <ul>
          <li>Monorepo workspace structure</li>
          <li>Shared TypeScript baseline</li>
          <li>Vercel-friendly API layout</li>
          <li>Product-branded starter UI</li>
        </ul>
      </section>
    </main>
  )
}

export default App
