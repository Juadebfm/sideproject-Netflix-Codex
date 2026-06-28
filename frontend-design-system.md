## Frontend Design System - Netflix Codex

### Product Surface

- A mobile-first, content-heavy discovery app that helps users find better Netflix recommendations faster.
- Serves casual viewers, film lovers, and couples or groups trying to decide together.
- Phone is the primary context, with tablet and desktop layouts supporting deeper browsing, filtering, and side-by-side comparison.

### Recommended UI Direction

- Chosen direction: editorial streaming concierge.
- The interface should feel premium, sharp, and trustworthy, closer to a modern film guide than a crowded streaming dashboard.
- This fits the product because users need confidence and clarity, not more visual noise. It also gives room for recommendation quality, category codes, and region signals to feel curated instead of dumped on screen.
- Avoid copying Netflix too closely. The product can feel adjacent to streaming culture without looking like a clone of Netflix's UI.

### Foundations

- Color tokens:
  - `--color-bg-app`: `#0b0d10`
  - `--color-bg-surface`: `#131722`
  - `--color-bg-elevated`: `#1a2130`
  - `--color-bg-highlight`: `#20293b`
  - `--color-text-primary`: `#f5f1e8`
  - `--color-text-secondary`: `#b7bfcb`
  - `--color-text-muted`: `#8892a0`
  - `--color-border-subtle`: `rgba(255, 255, 255, 0.10)`
  - `--color-border-strong`: `rgba(255, 255, 255, 0.18)`
  - `--color-accent`: `#ffb44d`
  - `--color-accent-strong`: `#ff8a3d`
  - `--color-info`: `#6eb7ff`
  - `--color-success`: `#74d6a3`
  - `--color-warning`: `#ffd36a`
  - `--color-danger`: `#ff7272`
- Typography roles:
  - Display and section headings: `Sora`, strong weight, tight line length.
  - Body and UI text: `Manrope`, optimized for small mobile text and filter-heavy screens.
  - Metadata and codes: `IBM Plex Mono` for copyable Netflix codes, technical labels, and compact stats.
- Spacing scale:
  - Base unit `4px`.
  - Primary scale: `4, 8, 12, 16, 24, 32, 48, 64`.
  - Vertical rhythm should favor `16` and `24` for breathing room on mobile.
- Radius scale:
  - `--radius-sm`: `10px`
  - `--radius-md`: `16px`
  - `--radius-lg`: `24px`
  - `--radius-pill`: `999px`
- Elevation and border rules:
  - Use layered dark surfaces plus subtle borders before heavy shadows.
  - Reserve shadows for overlays, floating action areas, and key recommendation cards.
  - Keep borders soft and consistent; avoid bright outline boxes except for focus states.
- Motion and icon guidance:
  - Motion should feel deliberate and brief: `140ms` to `220ms` for hover, press, reveal, and drawer transitions.
  - Use slight vertical lift and opacity changes instead of large scaling effects.
  - Icons should be simple outline or duotone glyphs with consistent stroke weight.
  - Recommendation confidence, region availability, and copy/open actions should always have both icon and text support.

### Core Components

- App shell:
  - Sticky top search and region bar on mobile.
  - Bottom navigation for primary sections on small screens.
  - Left rail or top nav on desktop.
- Search and discovery:
  - Global search input for mood, genre, film traits, and category codes.
  - Filter chips for tone, runtime, language, year, region, and group-friendly picks.
  - Suggestion panel with recent searches and recommended quick-start intents.
- Recommendation cards:
  - Poster or artwork, title, short reason to watch, region signal, confidence label, and available actions.
  - Primary actions: `Copy code`, `Open in Netflix`.
  - Secondary actions: `Save`, `Share`, `Not for me`.
- Code surfaces:
  - Dedicated code badge with monospaced styling.
  - One-tap copy feedback with explicit success state.
  - Deep-link module that explains what happens before opening Netflix.
- Lists and collections:
  - Curated shelves for moods, hidden gems, award winners, family picks, group picks, and region-aware categories.
  - Dense list view for power users and richer card view for casual users.
- Group and preference UI:
  - Lightweight preference picker for shared mood or veto-style narrowing.
  - No complex multi-user workflow in the first version unless product scope expands.
- Status and system states:
  - Loading skeletons for cards and shelves.
  - Empty states with next-best actions instead of dead ends.
  - Error states that separate network problems, no results, and unsupported region signals.
  - Availability badges: `Available`, `Possibly unavailable`, `Region unclear`.

### Responsive And Accessibility Standards

- Breakpoint thinking:
  - Start at `320px` and optimize for one-handed mobile use.
  - Suggested breakpoints: `480px`, `768px`, `1024px`, `1280px`.
  - Mobile gets single-column flows and bottom actions first; desktop can add comparison layouts and richer shelf density.
- Keyboard and focus expectations:
  - Every interactive element must be reachable and usable by keyboard.
  - Visible focus rings must use a dedicated token and remain obvious on dark surfaces.
  - Search suggestions, chip groups, drawers, and dialogs must have predictable focus order and escape behavior.
- Contrast and status feedback expectations:
  - Text and controls should meet WCAG AA contrast at minimum.
  - Status cannot rely on color alone; availability and confidence need text labels plus iconography.
  - Copy, save, and open actions need immediate feedback that is readable by sighted users and screen reader users.
- Reduced-motion and semantic requirements:
  - Respect `prefers-reduced-motion` by disabling non-essential motion and using simple fades where needed.
  - Use semantic HTML for navigation, search, buttons, lists, dialogs, and headings.
  - Touch targets should be at least `44x44px`.
  - Poster art must never be the only carrier of important meaning.

### Engineering Rules

- Build the frontend as a React application with a shared design-token layer and reusable component primitives.
- Keep routing, state, and data-fetching choices lightweight; do not recreate a framework worth of abstractions inside the app.
- All colors, spacing, radii, border values, focus states, shadows, and motion timings must come from tokens.
- Never hardcode Netflix-code badge colors, availability colors, or recommendation confidence colors inside components.
- Build components from semantic primitives first, then apply styling through shared tokens and variants.
- Use a single icon library and a single source of truth for component states.
- Keep component variants explicit: default, hover, pressed, focus-visible, disabled, loading, selected, error, success.
- Recommendation cards, chips, badges, drawers, and nav items should be reusable primitives, not one-off page styling.
- Direct-open behavior should be encapsulated in a dedicated component or helper so platform-specific behavior is not scattered through the UI.

### Open Questions

- Whether the brand should stay fully independent from Netflix visually or borrow a small amount of streaming-culture familiarity.
- How strong the region-availability signal can be in the MVP if data sources are incomplete.
- Whether group decision support is a simple shared filter flow or a more distinct feature area.
- What user-facing explanation is needed when a copied code or deep link does not behave the same way across devices.

### Suggested Next Steps

- Use `bootstrap` to create the broader project context files so this design system sits beside shared product, architecture, testing, and review guidance.
- Use `architect` next to turn this design direction into feature and implementation plans.
- Use `access` during UI implementation to review search, filters, copy feedback, dialogs, and mobile navigation.
