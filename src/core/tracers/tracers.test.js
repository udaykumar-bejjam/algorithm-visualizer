/**
 * @jest-environment node
 */

jest.mock('./Tracer', () => {
  class Tracer {
    constructor(key, getObject, title) {
      this.key = key;
      this.getObject = getObject;
      this.title = title;
      this.init();
      this.reset();
    }

    init() {}

    set() {}

    reset() {
      this.set();
    }

    getRendererClass() {
      return null;
    }
  }
  return { __esModule: true, default: Tracer };
});

jest.mock('../renderers', () => ({
  GraphRenderer: class GraphRenderer {},
}));

const TreeTracer = require('./TreeTracer').default;
const LinkedListTracer = require('./LinkedListTracer').default;

describe('TreeTracer', () => {
  it('builds a binary tree from nested arrays', () => {
    const tracer = new TreeTracer('tree', () => null, 'Tree');
    tracer.set([1, [2], [3, [4], [5]]]);
    expect(tracer.nodes).toHaveLength(5);
    expect(tracer.edges).toHaveLength(4);
    expect(tracer.isDirected).toBe(true);
  });
});

describe('LinkedListTracer', () => {
  it('lays out nodes left to right', () => {
    const tracer = new LinkedListTracer('list', () => null, 'List');
    tracer.set([10, 20, 30]);
    expect(tracer.nodes).toHaveLength(3);
    expect(tracer.edges).toHaveLength(2);
    expect(tracer.nodes[0].x).toBeLessThan(tracer.nodes[1].x);
    expect(tracer.nodes[1].x).toBeLessThan(tracer.nodes[2].x);
  });
});
