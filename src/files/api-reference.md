# Tracer API Reference

Use these tracers from JavaScript, C++, or Java visualization libraries to drive the player.

## Layout

- `Layout.setRoot(layout)` — set the visualization root
- `new VerticalLayout([tracers…])` / `new HorizontalLayout([tracers…])` — compose panes

## Common pattern

```js
const { Array1DTracer, Layout, LogTracer, Tracer, VerticalLayout } = require('algorithm-visualizer');

const tracer = new Array1DTracer('Array');
const logger = new LogTracer('Log');
Layout.setRoot(new VerticalLayout([tracer, logger]));
tracer.set([1, 2, 3]);
Tracer.delay();
tracer.select(0);
logger.println('selected 0');
Tracer.delay();
```

## Array1DTracer

| Method | Description |
|--------|-------------|
| `set(array)` | Replace data |
| `patch(i, v?)` / `depatch(i)` | Highlight a write |
| `select(from, to?)` / `deselect(…)` | Highlight a range |
| `chart(chartTracerKey)` | Sync with a ChartTracer |

## Array2DTracer

| Method | Description |
|--------|-------------|
| `set(matrix)` | Replace grid |
| `patch(x, y, v?)` / `depatch(x, y)` | Cell write highlight |
| `select(sx, sy, ex?, ey?)` / `deselect(…)` | Rectangle |
| `selectRow` / `selectCol` / `deselectRow` / `deselectCol` | Row/column helpers |

## ChartTracer / ScatterTracer

ChartTracer extends Array1D (bar chart). ScatterTracer extends Array2D; cell values should be `[x, y]` pairs.

## GraphTracer

| Method | Description |
|--------|-------------|
| `set(adjMatrix)` | Build from adjacency matrix |
| `directed(bool)` / `weighted(bool)` | Flags |
| `addNode` / `addEdge` / `removeNode` / `removeEdge` | Mutate |
| `layoutCircle` / `layoutTree` / `layoutRandom` | Layout |
| `visit` / `leave` / `select` / `deselect` | Animate traversal |
| `log(logTracerKey)` | Mirror events to a LogTracer |

## TreeTracer

`set(root)` where `root` is a nested array `[value, left?, right?, …]` or `{ value, children: […] }`. Uses tree layout automatically.

## LinkedListTracer

`set(array)` lays nodes out left-to-right with edges between consecutive elements.

## LogTracer / MarkdownTracer

- Log: `print`, `println`, `printf`, `set`
- Markdown: `set(markdown)`

## Delay

Call `Tracer.delay()` (optionally with a line number) to create a playback frame.
