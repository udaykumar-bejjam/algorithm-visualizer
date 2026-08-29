# Architecture

## Application shell

```
BrowserRouter
  └── Provider (Redux store)
        └── App
              ├── Header (+ Player)
              ├── ResizableContainer (horizontal)
              │     ├── Navigator
              │     ├── VisualizationViewer
              │     └── TabContainer → CodeEditor → FoldableAceEditor
              └── ToastContainer
```

Default pane weights: Navigator `1`, Viewer `2`, Editor `2`. Navigator can be toggled via the header title bar.

## Routes

| Path | Meaning |
|------|---------|
| `/` | Home — project README in the editor |
| `/:categoryKey/:algorithmKey` | Curated algorithm from the server |
| `/scratch-paper/:gistId` | User gist (`new` for blank / forked visualization) |

Query: `?visualizationId=` with `gistId=new` loads a prebuilt visualization JSON from the server.

Optional SSR/server injection via `public/index.html`:

- `$TITLE`, `$DESCRIPTION`
- `window.__PRELOADED_ALGORITHM__` — skips network if set (or `null` = not found)

## End-to-end visualization pipeline

```
┌────────────┐   TracerApi    ┌──────────────┐   delay splits   ┌────────┐
│ Source file│ ─────────────► │ Command list │ ───────────────► │ Chunks │
│ js/cpp/java│  (worker/POST) │ {key,method, │    (Player)      │ +cursor│
│ md / json  │                │  args}[]     │                  └────┬───┘
└────────────┘                └──────────────┘                       │
                                                                     ▼
                                                          VisualizationViewer
                                                          objects{} + root
                                                                     │
                     Layout.render() / Tracer.render()               ▼
                                                          Renderers (DOM/SVG/Chart)
```

1. **Build** (`Player.build`): extension → `TracerApi[ext]` → array of commands.
2. **Chunking**: commands between `{ key: null, method: 'delay', args: [lineNumber] }` become one playback frame.
3. **Cursor**: `1..chunks.length`; play advances with interval `4000 / Math.exp(speed)`.
4. **Apply**: forward cursor applies delta chunks; backward resets and replays from the start.
5. **Line sync**: last chunk’s `lineNumber` → Redux `player.lineIndicator` → Ace marker.

## Redux store

Created in `src/index.js` with `combineReducers({ ...reducers, routing: routerReducer })`.

> **Note:** `reducers/index.js` also exports `actions`. Spreading `...reducers` into `combineReducers` may register a non-reducer `actions` key. Prefer importing only reducer slices.

### Slices

| Slice | Responsibility |
|-------|----------------|
| `current` | Active algorithm or scratch paper, files, editing file, dirty flag, `shouldBuild` |
| `directory` | Navigator categories + scratch paper list |
| `env` | Preferred language `ext` (cookie), GitHub `user` |
| `player` | `chunks`, `cursor`, `lineIndicator` |
| `toast` | Ephemeral success/error messages |
| `routing` | Legacy react-router-redux (largely unused with `BrowserRouter`) |

Async work (API calls, workers, timers) lives in **components**, not middleware.

### Dirty / saved model

`isSaved` serializes `{ titles, files: [{name, content}] }` and compares to `lastTitles` / `lastFiles`. Navigation is blocked via `history.block` and `onbeforeunload` when unsaved.

### Build triggers (`shouldBuild`)

| Event | `shouldBuild` |
|-------|---------------|
| Load algorithm / scratch / home | `true` |
| Switch editing file | `true` |
| Add / delete file | `true` |
| Modify `.md` content | `true` |
| Modify code / rename | `false` for code (manual Build); rename shares modify handler |

## Component dependency graph

```
App
├── Header ── Player ── ProgressBar
│         └── Button, ListItem, Ellipsis
├── ResizableContainer ── Divider
│   ├── Navigator ── ExpandableListItem ── ListItem ── Button
│   ├── VisualizationViewer ── core/tracers + core/layouts
│   └── TabContainer
│       └── CodeEditor ── FoldableAceEditor
└── ToastContainer

BaseComponent ← App, Header, Player, VisualizationViewer
```

`BaseComponent.handleError` maps axios/errors to `showErrorToast`.

## Auth model

1. User opens `/api/auth/request` (popup).
2. Server callback is expected to call `window.signIn(accessToken)`.
3. App stores cookie `access_token`, sets axios `Authorization: token …`, loads GitHub user + gists tagged with file `algorithm-visualizer`.
4. Sign-out: `/api/auth/destroy` + `window.signOut` clears cookie, header, user, scratch list.

## Proxy

`package.json` `"proxy": "http://localhost:8080"` — CRA forwards `/api` to the local server. For frontend-only work, temporarily proxy to `https://algorithm-visualizer.org` (do not commit).
