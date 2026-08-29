# Feature Catalog

## Workspace UI

| Feature | Description | Primary code |
|---------|-------------|--------------|
| Three-pane layout | Navigator / visualization / editor; resizable weights | `App`, `ResizableContainer` |
| Mobile panes | Narrow screens show one pane + Algorithms / Visualize / Code tabs | `App`, `MobilePaneBar` |
| Collapse navigator | Click header title bar | `App.handleClickTitleBar` |
| Document title | Helmet title; `(Unsaved)` prefix when dirty | `App.render` |
| Toasts | Success/error; auto-hide ~3s | `ToastContainer`, `BaseComponent` |
| Fullscreen | `screenfull` toggle | `Header` |
| Theme | Dark / light via Settings; cookie `theme` | `env.setTheme`, CSS `--*` tokens |
| Motion | Ease between playback chunks; Settings toggle | `env.setMotionEnabled`, `common/motion` |

## Algorithm browsing

| Feature | Description | Primary code |
|---------|-------------|--------------|
| Category tree | Loaded from `GET /api/algorithms` | `App` → `setCategories`, `Navigator` |
| Search | Filters categories/algorithms; acronym + substring | `Navigator.testQuery` |
| Open algorithm | Route `/:categoryKey/:algorithmKey` | `App.loadAlgorithm` |
| Default file tab | Prefer `.json`, then language ext, then any known | `App.selectDefaultTab` |
| Contributors | Shown under editor; links to GitHub | `CodeEditor` |

## Scratch Paper

| Feature | Description | Primary code |
|---------|-------------|--------------|
| New scratch | `/scratch-paper/new` + language skeleton | `App.loadAlgorithm` |
| From visualization id | `?visualizationId=` loads JSON into `visualization.json` | `VisualizationApi` |
| Open gist | `/scratch-paper/:gistId` via GitHub API | `GitHubApi.getGist`, `refineGist` |
| List my papers | Gists containing file `algorithm-visualizer` | `App.loadScratchPapers` |
| Editable title | Autosize input in header | `Header`, `modifyTitle` |
| Save / create | Requires sign-in; writes marker file | `Header.saveGist` |
| Fork then edit | If gist owned by someone else | `forkGist` + `editGist` |
| Delete | API delete or discard `new` | `Header.deleteGist` |
| Share | Facebook share URL | `Header` |
| Unsaved guard | `history.block` + `beforeunload` | `App.toggleHistoryBlock` |

## Code editing

| Feature | Description | Primary code |
|---------|-------------|--------------|
| Ace editor | Theme tomorrow_night_eighties | `FoldableAceEditor` |
| Modes | js / c_cpp / java / markdown / json / plain | `CodeEditor` |
| Fold tracer regions | Folds lines matching `^\s*\/\/.+{\s*$` | `FoldableAceEditor.foldTracers` |
| File tabs | Switch, rename, add (`code-N.ext`) | `TabContainer` |
| Delete file | Confirm-needed button | `CodeEditor` |
| Language preference | Header dropdown; cookie `ext` | `env.setExt` |
| Line highlight | Current playback line | `player.lineIndicator` → Ace markers |

## Build & playback

| Feature | Description | Primary code |
|---------|-------------|--------------|
| Build | Run tracer for current file ext | `Player.build`, `TracerApi` |
| Auto-build | On mount / file switch when `shouldBuild` | `Player` |
| Cancel in-flight | axios CancelToken / worker terminate | `Player`, `TracerApi.js` |
| Play / Pause | Timed cursor advance | `Player.resume` / `pause` |
| Step prev / next | Manual cursor | `Player.prev` / `next` |
| Scrub | Progress bar drag | `ProgressBar`, `handleChangeProgress` |
| Speed | 0–4; interval `4000 / e^speed` | `Player` |
| Export JSON | Download command list as `visualization.json` | `Player.exportCommands` |
| Export GIF / WebM | Step through frames, capture viewer DOM, download animation | `Player.exportMedia`, `common/exportMedia` |
| Breakpoints | Double-click progress bar to toggle stop points | `Player`, `ProgressBar` |
| Unsupported language | Toast error | `Player.build` |

## Visualization types

| Tracer | Visual | Notes |
|--------|--------|-------|
| `Array1DTracer` | Row of values | Can sync to Chart |
| `Array2DTracer` | Table / grid | select / patch regions |
| `ChartTracer` | Bar chart | Shares Element data with Array1D |
| `ScatterTracer` | Scatter plot | Values as `[x,y]` |
| `GraphTracer` | SVG graph | circle / tree / random layout; visit/select |
| `LogTracer` | Console panel | print / println / printf |
| `MarkdownTracer` | Rendered markdown | Home / README views |
| `VerticalLayout` / `HorizontalLayout` | Nested resizable panes | Composition root via `setRoot` |

## Authentication

| Feature | Description |
|---------|-------------|
| Sign in | `/api/auth/request` → `window.signIn(token)` |
| Persist | Cookie `access_token` |
| Sign out | `/api/auth/destroy` + clear state |
| Guest | Can browse/build; cannot save gists |

## External links (Navigator footer)

- API Reference (wiki)
- GitHub organization / repo

## PWA / SEO

- Web app manifest (standalone, any orientation)
- Open Graph image in `index.html`
- robots disallow scratch papers
- Service worker (`public/sw.js`) caches a minimal offline shell in production
