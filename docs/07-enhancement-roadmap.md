# Enhancement Roadmap

Prioritized improvements based on a full codebase review. Difficulty is expressed by **scope of change** and **risk**, not calendar estimates.

---

## P0 — Correctness & safety

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P0.1 | Sanitize `LogRenderer` output (text nodes / escape HTML) | `dangerouslySetInnerHTML` on tracer logs is XSS-prone for shared gists | Small — one renderer |
| P0.2 | Enable markdown HTML escaping or sanitize AST | `escapeHtml={false}` in `MarkdownRenderer` | Small |
| P0.3 | Fix Navigator search lag | `handleChangeQuery` calls `testQuery` against **stale** `query` state (opens categories one keystroke behind) | Tiny |
| P0.4 | Guard Graph `visit`/`select` on missing nodes; clean edges on `removeNode` | Throws / dangling edges | Small — GraphTracer + GraphRenderer |
| P0.5 | Abort Player timer & cancel tokens on unmount | Leaks / setState-after-unmount | Small |
| P0.6 | ProgressBar when `total === 0` | `NaN%` width before first build | Tiny |

## P1 — Platform modernization

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P1.1 | Replace `node-sass` with `sass` (Dart Sass) | `node-sass` blocked on modern Node | Medium — build toolchain |
| P1.2 | Upgrade CRA → Vite (or CRA 5 / Next) + React 18 | CRA 3 / React 16 EOL; unlock concurrent features | **Done** — Vite 5 + React 18 |
| P1.3 | Replace deprecated `componentWillReceiveProps` | Soft warnings → hard removal in future React | Medium — App, Player, Viewer, Navigator, Toast |
| P1.4 | Upgrade axios to 1.x; pin `bluebird`/`brace` (drop `latest`) | Security & reproducible installs | Small–medium |
| P1.5 | Remove or replace `react-router-redux` | Incompatible with RR v5 usage | Small |
| P1.6 | Migrate UA → GA4 or remove analytics | UA sunset | Small |
| P1.7 | Raise `engines.node` to active LTS | Honest runtime requirements | Tiny + CI |

## P2 — Architecture quality

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P2.1 | Immutable frame snapshots per chunk | Rewind currently O(n) full replay; `layoutRandom` non-deterministic | Large — Player + Viewer |
| P2.2 | Formal command schema (JSON Schema / TS types) shared with tracers.* | Silent runtime failures on bad commands | Medium |
| P2.3 | Move async to Redux Toolkit + thunks/listeners | Logic trapped in class components; hard to test | Large |
| P2.4 | Convert critical paths to TypeScript | Zero types today | Large (incremental OK) |
| P2.5 | Fix `combineReducers({ ...reducers })` exporting `actions` into the store | Accidental store key | Tiny |
| P2.6 | Relative imports inside `core/tracers` | Barrel self-imports risk circular init | Small |
| P2.7 | Separate view-model from tracer instances | GraphRenderer mutates node positions on drag during playback model | Medium |

## P3 — Product features

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P3.1 | Auto-rebuild debounce for code edits (optional toggle) | Today code edits need manual Build; easy to miss | Medium |
| P3.2 | Export visualization as GIF/WebM / share link preview | Teaching & social | Large — new pipeline |
| P3.3 | Dark/light theme tokens + accessibility pass | Contrast, keyboard (Button is often a `<div>`) | Medium |
| P3.4 | Mobile / portrait layout | Manifest forces landscape; panes unusable on phones | Large — layout system |
| P3.5 | Python (or more languages) tracer support | Community demand; needs server + tracers.* + config | Large — multi-repo |
| P3.6 | Step breakpoints / watch expressions | Power-user debugging of algorithms | Large |
| P3.7 | Collaborative scratch paper (live cursors) | Education classrooms | Large |
| P3.8 | Offline / true PWA with service worker | Manifest exists but no SW | Medium |
| P3.9 | In-app tracer API docs / snippets palette | Reduces wiki dependency | Medium |
| P3.10 | Deterministic random layouts (seed in delay/chunk) | Stable scrubbing | Small–medium |

## P4 — Visualization engine richness

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P4.1 | TreeTracer / LinkedListTracer specialized renderers | Common CS structures awkwardly faked with Graph | Medium–large |
| P4.2 | Upgrade Chart.js v3+; stable scatter labels; theme colors | Random labels; outdated API | Medium |
| P4.3 | Auto-fit Graph viewBox to container | Fixed 320×320 base feels cramped | Small–medium |
| P4.4 | Selected/patched styling for Scatter | Parity with Chart/Array | Small |
| P4.5 | Animation easing between chunks | Abrupt frame cuts | Medium |
| P4.6 | Sound / narration hooks (optional) | Accessibility & engagement | Medium |

## P5 — Engineering hygiene

| ID | Enhancement | Why | Scope |
|----|-------------|-----|-------|
| P5.1 | Unit tests for Player chunking, Viewer applyCommand, `isSaved`, `refineGist` | Zero tests today | Medium |
| P5.2 | Component tests (React Testing Library) for Navigator search, TabContainer | Regression safety | Medium |
| P5.3 | ESLint + Prettier + CI | Consistency | Small |
| P5.4 | Storybook for renderers | Visual regression of tracers | Medium |
| P5.5 | Dependabot / renovate | Dependency drift | Small |
| P5.6 | Document server contract with OpenAPI | Frontend/backend drift | Medium |

---

## Suggested sequencing

```
P0 safety fixes
    → P1.1 sass + engines (unblock modern Node)
    → P5.1–5.3 tests + lint (safety net)
    → P1.2–1.5 React/router/axios modernization
    → P2.1 / P2.2 visualization reliability
    → P3 product bets (languages, export, a11y)
```

## Known bugs to track (from audit)

1. Navigator search category auto-expand uses stale query.
2. `Player.resume(wrap)` treats Redux action return as success (works by accident).
3. Empty `contributors: []` skips guest avatar fallback.
4. Graph `removeNode` leaves orphan edges.
5. Divider / ProgressBar document listeners not removed on unmount if mid-drag.
6. VisualizationViewer may not re-render when `lineIndicator` stays `undefined` across applications that still change visuals (relies on Redux identity changes from cursor/chunks).

## Non-goals (for this frontend alone)

- Implementing C++/Java compilers (belongs in `server` / tracers).
- Authoring curated algorithm content (belongs in `algorithms`).
- Changing the public tracer API without coordinated tracers.* releases.
