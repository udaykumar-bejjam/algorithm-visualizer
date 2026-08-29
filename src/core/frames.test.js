import { describe, it, expect, vi } from 'vitest';

vi.mock('./renderers/Renderer', () => ({
  default: class Renderer {},
}));

vi.mock('./renderers', () => ({
  Renderer: class Renderer {},
  Array2DRenderer: class Array2DRenderer {},
  Array1DRenderer: class Array1DRenderer {},
  LogRenderer: class LogRenderer {},
  GraphRenderer: class GraphRenderer {},
  ChartRenderer: class ChartRenderer {},
  ScatterRenderer: class ScatterRenderer {},
  MarkdownRenderer: class MarkdownRenderer {},
}));

vi.mock('components', () => ({
  ResizableContainer: ({ children }) => children,
}));

import Array2DTracer from './tracers/Array2DTracer';
import LogTracer from './tracers/LogTracer';
import VerticalLayout from './layouts/VerticalLayout';
import { captureFrame, restoreFrame } from './frames';

describe('immutable frame snapshots', () => {
  it('round-trips tracer state via capture/restore', () => {
    const objects = {};
    const getObject = key => objects[key];
    const tracer = new Array2DTracer('arr', getObject, 'Grid');
    tracer.set([[1, 2], [3, 4]]);
    tracer.select(0, 1);
    tracer.patch(1, 0, 9);

    const snapshot = tracer.captureState();
    tracer.data[0][1].value = 100;

    const restored = new Array2DTracer('arr', getObject, 'Grid');
    restored.restoreState(snapshot);

    expect(restored.data[0][1].value).toBe(2);
    expect(restored.data[0][1].selected).toBe(true);
    expect(restored.data[1][0].value).toBe(9);
    expect(restored.data[1][0].patched).toBe(true);
  });

  it('restores a full object graph from a captured frame', () => {
    const objects = {};
    const getObject = key => objects[key];

    objects.arr = new Array2DTracer('arr', getObject, 'Grid');
    objects.log = new LogTracer('log', getObject, 'Console');
    objects.arr.set([[1, 2]]);
    objects.arr.select(0, 0);
    objects.log.println('hello');
    objects.layout = new VerticalLayout('layout', getObject, ['arr', 'log']);

    const frame = captureFrame(objects, objects.layout);
    objects.arr.data[0][0].value = 99;

    const restored = restoreFrame(frame);
    expect(restored.root.key).toBe('layout');
    expect(restored.objects.arr.data[0][0].value).toBe(1);
    expect(restored.objects.arr.data[0][0].selected).toBe(true);
    expect(restored.objects.log.log).toContain('hello');
    expect(restored.objects.layout.childKeys).toEqual(['arr', 'log']);
  });
});
