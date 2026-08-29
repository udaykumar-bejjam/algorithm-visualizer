import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  VIEWER_SELECTOR,
  findViewerElement,
  downloadBlob,
  encodeAndDownloadGif,
  captureFrameSequence,
} from './exportMedia';

describe('findViewerElement', () => {
  it('finds the visualization viewer via data attribute', () => {
    const root = document.createElement('div');
    root.innerHTML = '<div data-visualization-viewer></div>';
    expect(findViewerElement(root)).toBe(root.querySelector(VIEWER_SELECTOR));
  });

  it('returns null when missing', () => {
    expect(findViewerElement(document.createElement('div'))).toBeNull();
  });
});

describe('downloadBlob', () => {
  beforeEach(() => {
    if (!URL.createObjectURL) {
      URL.createObjectURL = () => '';
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = () => {};
    }
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a temporary anchor and clicks it', () => {
    const click = vi.fn();
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
      Object.defineProperty(node, 'click', { value: click });
      return node;
    });
    const removeChild = vi.spyOn(document.body, 'removeChild').mockImplementation(node => node);

    downloadBlob(new Blob(['x'], { type: 'text/plain' }), 'out.txt');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(appendChild).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });
});

describe('captureFrameSequence', () => {
  it('rejects empty totals', async () => {
    await expect(captureFrameSequence({
      total: 0,
      goTo: () => {},
    })).rejects.toThrow(/Nothing to export/);
  });
});

describe('encodeAndDownloadGif', () => {
  beforeEach(() => {
    if (!URL.createObjectURL) {
      URL.createObjectURL = () => '';
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = () => {};
    }
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:gif');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(document.body, 'appendChild').mockImplementation(node => {
      Object.defineProperty(node, 'click', { value: vi.fn() });
      return node;
    });
    vi.spyOn(document.body, 'removeChild').mockImplementation(node => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('encodes a solid frame without throwing', async () => {
    const width = 4;
    const height = 4;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
    const frame = { width, height, data };

    await expect(encodeAndDownloadGif([frame], { delayMs: 100, filename: 't.gif' }))
      .resolves.toBeUndefined();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('rejects empty frame lists', async () => {
    await expect(encodeAndDownloadGif([])).rejects.toThrow(/No frames/);
  });
});
