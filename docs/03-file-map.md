# File Map

Complete inventory of the repository for navigation and ownership.

## Root

| Path | Role |
|------|------|
| `package.json` / `package-lock.json` | Dependencies, CRA scripts, proxy, engines |
| `jsconfig.json` | `baseUrl: "src"` for bare imports |
| `README.md` | Public project readme |
| `CONTRIBUTING.md` | Local / Gitpod setup, directory structure |
| `CODE_OF_CONDUCT.md` | Contributor Covenant 1.4 |
| `LICENSE` | MIT © 2019 Jinseo Jason Park |
| `.gitignore` | Standard CRA ignores |
| `.gitpod.yml` | Clones `server`, installs, starts both apps |
| `.github/FUNDING.yml` | GitHub funding links |
| `branding/` | Logo, icon, screenshot (png/psd) |
| `docs/` | Internal documentation (this folder) |

## `public/`

| Path | Role |
|------|------|
| `index.html` | Shell; GA; `$TITLE` / `$DESCRIPTION` / `$ALGORITHM` placeholders |
| `manifest.json` | PWA manifest (fullscreen, landscape) — no service worker |
| `robots.txt` | Disallows `/scratch-paper/` |
| `favicon.png`, `icons/*` | App icons |

## `src/`

### Entry

| Path | Role |
|------|------|
| `index.js` | Store, Router, routes → `App` |
| `stylesheet.scss` | Global resets, full-bleed layout |

### `apis/`

| Path | Role |
|------|------|
| `index.js` | HTTP helpers + `AlgorithmApi`, `VisualizationApi`, `GitHubApi`, `TracerApi` |

### `common/`

| Path | Role |
|------|------|
| `config.js` | Languages (js/cpp/java), Ace modes, skeletons |
| `util.js` | `classes`, `distance`, `extension`, gist refine, file factories, `isSaved` |
| `theme.js` | Dark/light palettes, `applyDocumentTheme`, Chart/Ace helpers |
| `exportMedia.js` | Capture viewer frames; encode/download GIF & WebM |
| `stylesheet/colors.scss` | Theme CSS variables (+ SCSS aliases) |
| `stylesheet/fonts.scss` | Font stacks |
| `stylesheet/dimensions.scss` | Line height, font sizes |
| `stylesheet/index.scss` | Barrel for styles |

### `reducers/`

| Path | Role |
|------|------|
| `index.js` | Re-exports slices + combined `actions` |
| `current.js` | Workspace document state |
| `directory.js` | Categories + scratch papers |
| `env.js` | Language + user |
| `player.js` | Playback chunks/cursor/line |
| `toast.js` | Toast queue |

### `files/`

| Path | Role |
|------|------|
| `index.js` | raw-loader wrappers → exported file objects |
| `algorithm-visualizer/README.md` | Home editor content |
| `scratch-paper/README.md` | New scratch paper companion doc |
| `skeletons/code.js` | JS starter visualization |
| `skeletons/code.cpp` | C++ starter |
| `skeletons/code.java` | Java starter |

### `components/`

| Component | Files | Role |
|-----------|-------|------|
| `App` | `index.js`, `App.module.scss` | Shell, loading, auth, history block |
| `BaseComponent` | `index.js` | Shared `handleError` → toast |
| `Header` | `index.js`, `*.scss` | Title, gist ops, auth, language, Player |
| `Navigator` | `index.js`, `*.scss` | Search, categories, scratch list |
| `VisualizationViewer` | `index.js`, `*.scss` | Command interpreter + root render |
| `CodeEditor` | `index.js`, `*.scss` | Ace + contributors + delete |
| `FoldableAceEditor` | `index.js` | Ace subclass; folds `// … {` regions |
| `TabContainer` | `index.js`, `*.scss` | File tabs, rename, add |
| `Player` | `index.js`, `*.scss` | Build / play / step / speed |
| `ProgressBar` | `index.js`, `*.scss` | Scrubbable progress |
| `ResizableContainer` | `index.js`, `*.scss` | Weighted panes + dividers |
| `Divider` | `index.js`, `*.scss` | Drag handle |
| `Button` | `index.js`, `*.scss` | Link / anchor / div control |
| `ListItem` | `index.js`, `*.scss` | Nav row |
| `ExpandableListItem` | `index.js`, `*.scss` | Collapsible category |
| `Ellipsis` | `index.js`, `*.scss` | Truncating text |
| `ToastContainer` | `index.js`, `*.scss` | Toast stack |
| `index.js` | — | Barrel export |

### `core/tracers/`

| File | Role |
|------|------|
| `Tracer.jsx` | Base tracer |
| `MarkdownTracer.js` | Markdown document |
| `LogTracer.js` | Console log (`print` / `println` / `printf`) |
| `Array2DTracer.js` | 2D grid + select/patch |
| `Array1DTracer.js` | 1D array + optional Chart link |
| `ChartTracer.js` | Bar chart (extends Array1D) |
| `ScatterTracer.js` | Scatter (extends Array2D) |
| `GraphTracer.js` | Graph + layouts + visit/select |
| `index.js` | Barrel (export names = command constructors) |

### `core/renderers/`

| Directory | Role |
|-----------|------|
| `Renderer/` | Base: title, pan, zoom, `toString` |
| `Array2DRenderer/` | HTML table |
| `Array1DRenderer/` | Table without row index column |
| `ChartRenderer/` | Chart.js Bar |
| `ScatterRenderer/` | Chart.js Scatter |
| `GraphRenderer/` | SVG nodes/edges, drag |
| `LogRenderer/` | Scrollable log (`dangerouslySetInnerHTML`) |
| `MarkdownRenderer/` | react-markdown |
| `index.js` | Barrel |

### `core/layouts/`

| File | Role |
|------|------|
| `Layout.js` | Child list, weights, `ResizableContainer` |
| `HorizontalLayout.js` | Horizontal marker subclass |
| `VerticalLayout.js` | Vertical marker subclass |
| `index.js` | Barrel |

## Approximate size

~4k lines under `src/` (JS/JSX/SCSS/skeletons). No automated tests in this repository.
