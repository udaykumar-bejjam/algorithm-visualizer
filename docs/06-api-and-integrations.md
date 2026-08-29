# APIs and Integrations

## HTTP layer

`src/apis/index.js`:

- Axios interceptor: resolve with `response.data` directly.
- Relative paths get prefix `/api`.
- URL tokens like `:id` are filled left-to-right from call arguments.
- Returns Bluebird promises.

### Argument conventions

| Verb | Call shape |
|------|------------|
| GET/DELETE | `(…pathArgs, params?, cancelToken?)` |
| POST/PUT/PATCH | `(…pathArgs, body?, params?, cancelToken?)` |

## Backend REST (proxied)

### Algorithms

| Client | Method | Path |
|--------|--------|------|
| `AlgorithmApi.getCategories` | GET | `/api/algorithms` |
| `AlgorithmApi.getAlgorithm` | GET | `/api/algorithms/:categoryKey/:algorithmKey` |

Expected algorithm payload includes `categoryKey`, `categoryName`, `algorithmKey`, `algorithmName`, `files[]`, `description`.

### Visualizations

| Client | Method | Path |
|--------|--------|------|
| `VisualizationApi.getVisualization` | GET | `/api/visualizations/:visualizationId` |

Used when opening `/scratch-paper/new?visualizationId=…` — content becomes `visualization.json`.

### Tracers

| Client | Method | Path / mechanism |
|--------|--------|------------------|
| `TracerApi.js` | Worker | `new Worker('/api/tracers/js/worker')` — `postMessage(code)` |
| `TracerApi.cpp` | POST | `/api/tracers/cpp` body `{ code }` |
| `TracerApi.java` | POST | `/api/tracers/java` body `{ code }` |
| `TracerApi.md` | Local | Synthetic MarkdownTracer commands |
| `TracerApi.json` | Local | `JSON.parse(code)` as command list |

JS cancel: terminate worker when CancelToken fires.

### Auth (links only)

| Action | URL |
|--------|-----|
| Sign in | `/api/auth/request` |
| Sign out | `/api/auth/destroy` |

Callback contract: invoke `window.signIn(accessToken)` in the opener context.

## GitHub API

Base: `https://api.github.com` with header `Authorization: token <access_token>`.

| Method | Use |
|--------|-----|
| `getUser` | Profile for header avatar / login |
| `listGists` | Paginated; filter gists with file `algorithm-visualizer` |
| `getGist` | Open scratch paper (`timestamp` cache-bust param) |
| `createGist` / `editGist` | Save |
| `forkGist` | Fork then edit when not owner |
| `deleteGist` | Delete scratch paper |

### Gist conventions

- Description = scratch paper title.
- Sentinel file `algorithm-visualizer` with content `https://algorithm-visualizer.org/` marks the gist.
- That file is stripped client-side by `refineGist`.
- Deleted editor files are sent as `filename: null` on edit.

## Dev proxy

```json
"proxy": "http://localhost:8080"
```

Frontend-only: temporarily point at production (never commit):

```diff
- "proxy": "http://localhost:8080",
+ "proxy": "https://algorithm-visualizer.org",
```

## Cookies

| Name | Purpose |
|------|---------|
| `access_token` | GitHub OAuth token |
| `ext` | Preferred language extension (`js` default) |

## Analytics

Universal Analytics property `UA-78128848-1` in `public/index.html` (UA is retired; migrate to GA4 if analytics remain required).
