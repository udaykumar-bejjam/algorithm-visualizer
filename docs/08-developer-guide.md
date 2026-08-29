# Developer Guide

## Prerequisites

- Node `>=18`
- npm
- Optional: local [`server`](https://github.com/algorithm-visualizer/server) on port 8080

## Run locally

```bash
git clone <your-fork>/algorithm-visualizer.git
cd algorithm-visualizer
npm install
npm start   # Vite → http://localhost:3000
```

### Frontend only (remote API)

Temporarily in `vite.config.js`:

```diff
- target: 'http://localhost:8080',
+ target: 'https://algorithm-visualizer.org',
```

Do not commit that change.

### With local server

Follow server `CONTRIBUTING.md`, then keep the Vite proxy target at `http://localhost:8080`.

### Gitpod

Open the repo in Gitpod (`.gitpod.yml` clones server, writes dummy env, starts both).

## Project conventions

| Topic | Convention |
|-------|------------|
| Imports | Bare from `src` (`components`, `apis`, `core/tracers`, …) via Vite aliases |
| Components | Class components; shared errors via `BaseComponent` |
| Styles | `*.module.scss` co-located; tokens in `common/stylesheet` / `common/theme.js` |
| State | Redux actions from `reducers` barrel; connect at leaf |
| Files | `{ name, content, contributors? }` |
| Tracer commands | Export **name** on barrel === constructor `method` string |
| Build | Vite (`npm start` / `npm run build` / `npm test` via Vitest) |

## How to add a UI component

1. Create `src/components/MyWidget/index.js` + optional `MyWidget.module.scss`.
2. Export from `src/components/index.js`.
3. Connect to Redux only if needed; prefer presentational + props.

## How to add a Tracer / Renderer

1. Implement `MyTracer` extending `Tracer` (or a specialized base).
2. Implement `MyRenderer` extending `Renderer`; set `getRendererClass()`.
3. Export both from `core/tracers/index.js` and `core/renderers/index.js` with the **exact public names** the language libraries will emit.
4. Coordinate with `tracers.js` / `.cpp` / `.java` so the same class names exist there.
5. Document methods in the wiki / `docs/05-visualization-engine.md`.

Layout classes must also be exported from `core/layouts` to be constructible via commands.

## How to add a language

1. Add skeleton under `src/files/skeletons/`.
2. Register in `common/config.js` (`name`, `ext`, Ace `mode`, `skeleton`).
3. Implement `TracerApi[ext]` in `apis/index.js` (usually POST to server).
4. Add server + tracers.* support — frontend alone is insufficient.
5. Ensure `FoldableAceEditor` fold regex matches that language’s region comments (or extend it).

## How to add a Redux field

1. Add action + handler in the appropriate slice under `reducers/`.
2. Export action from the slice `actions` object (merged in `reducers/index.js`).
3. Avoid putting the `actions` object into `combineReducers` — import slices explicitly.

## Debugging visualizations

1. Open DevTools; inspect Redux `player.chunks` after Build.
2. Confirm command order: construct tracers → construct layout → `setRoot` → mutations → `delay`.
3. If layout children are missing, constructors ran in the wrong order.
4. For JS, inspect worker errors via `TracerApi.js` `worker.onerror`.

## Useful mental models

- **Files in the editor are not “the program” alone** — JSON files can be raw command dumps; md builds a markdown tracer; code builds via language tracers.
- **Playback is discrete frames**, with optional CSS easing between chunk updates when Motion is enabled.
- **Tracers are mutable models**; renderers read them each React render.

## Docs map

Start at [docs/README.md](./README.md). For planned work see [07-enhancement-roadmap.md](./07-enhancement-roadmap.md).
