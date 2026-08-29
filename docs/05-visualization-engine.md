# Visualization Engine

The engine turns a **flat command list** into a live object graph of tracers and layouts, then renders from a designated root.

## Command protocol

Every command:

```ts
{
  key: string | null;   // target object id, or null for global ops
  method: string;       // class name OR instance method OR special
  args: any[];
}
```

### Special / global commands

| key | method | args | Effect |
|-----|--------|------|--------|
| `null` | `setRoot` | `[objectKey]` | Sets render root |
| `null` | `delay` | `[lineNumber?]` | Chunk boundary (Player); not applied by viewer |
| any | `destroy` | `[]` | Deletes `objects[key]` |

### Construction commands

If `method` matches an export on `core/layouts` or `core/tracers`:

```js
// Tracer: args[0] is title (defaults to class name)
{ key: 'arr', method: 'Array1DTracer', args: ['Array'] }

// Layout: args[0] is child key list (resolved immediately)
{ key: 'root', method: 'VerticalLayout', args: [['arr', 'log']] }
```

### Instance method commands

Otherwise:

```js
objects[key][method](...args)
// e.g. { key: 'arr', method: 'select', args: [0, 3] }
```

## Class hierarchy

```
Tracer
├── MarkdownTracer
├── LogTracer
├── Array2DTracer
│   ├── Array1DTracer
│   │   └── ChartTracer
│   └── ScatterTracer
└── GraphTracer

Layout
├── HorizontalLayout
└── VerticalLayout

Renderer
├── Array2DRenderer
│   ├── Array1DRenderer
│   │   └── ChartRenderer
│   └── ScatterRenderer
├── GraphRenderer
├── LogRenderer
└── MarkdownRenderer
```

Tracers implement `getRendererClass()` and `render()` → `<Renderer data={tracerInstance} />`.

## Tracer method reference

### Array2DTracer

| Method | Behavior |
|--------|----------|
| `set(array2d)` | Rebuild `Element[][]` with `{value, patched, selected}` |
| `patch(x,y,v?)` | Set value + patched |
| `depatch(x,y)` | Clear patched |
| `select` / `deselect` | Rectangle of cells |
| `selectRow` / `selectCol` / deselect* | Convenience spans |

### Array1DTracer

Wraps data as a single row. `patch`/`select` use column index.  
`chart(key)` links a `ChartTracer` and shares the `data` reference.

### ChartTracer / ScatterTracer

Thin subclasses swapping renderers. Scatter expects cell values `[x, y]`.

### GraphTracer

| Method | Behavior |
|--------|----------|
| `set(adjMatrix)` | Nodes + edges from matrix |
| `directed` / `weighted` | Flags |
| `addNode` / `updateNode` / `removeNode` | Nodes (`removeNode` does **not** clean edges) |
| `addEdge` / `updateEdge` / `removeEdge` | Edges |
| `layoutCircle` / `layoutTree` / `layoutRandom` | Positioning (remembered & reapplied) |
| `visit` / `leave` | visitedCount ±1; optional weight; may log |
| `select` / `deselect` | selectedCount ±1; may log |
| `log(key)` | Link `LogTracer` for arrow-style messages |

### LogTracer

`set`, `print`, `println`, `printf` (sprintf-js).

### MarkdownTracer

`set(markdown)`.

### Layout

`add`, `remove`, `removeAll`, weight changes via `ResizableContainer`.

## Viewer replay semantics

File: `components/VisualizationViewer/index.js`.

- Maintains `objects` map and `root` (not React state).
- Cursor **forward**: apply new chunks and **cache an immutable snapshot** per cursor (`core/frames.js`).
- Cursor **backward** / jump: restore from snapshot when available; otherwise replay from the start while filling the cache.
- Snapshots deep-copy tracer/layout state (`captureState` / `restoreState`), so scrubbing does not mutate prior frames.
- Seeded `layoutRandom` + snapshots keep rewind deterministic.
- Errors in `applyCommand` → toast via `BaseComponent`.

## Player chunking

File: `components/Player/index.js`.

```
commands → chunks[]
each delay closes current chunk (stores lineNumber) and opens a new empty chunk
```

After build: `setCursor(0)` then `next()` so the first real frame is shown.

## Coupling

| Link | Mechanism |
|------|-----------|
| Array1D → Chart | Shared `data` reference after `chart(key)` |
| Graph → Log | `log(key)` + println on visit/select |
| Layout → children | Keys resolved at Layout construction time |

**Ordering constraint:** Create child tracers **before** the Layout that references them, or children are `undefined`.

## Example (from JS skeleton)

```js
Layout.setRoot(new VerticalLayout([array2dTracer, logTracer]));
array2dTracer.set(messages);
Tracer.delay();
// … select / println / delay …
```

Compiles (via tracers.js worker) into constructor + `setRoot` + `set` + `delay` + method commands consumed by this app.

## Security notes

- `LogRenderer` uses `dangerouslySetInnerHTML` on log text.
- `MarkdownRenderer` sets `escapeHtml={false}`.

Treat visualization output as trusted only if the code source is trusted; sanitize before exposing untrusted gists more broadly.
