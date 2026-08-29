import { toCanvas } from 'html-to-image';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export const VIEWER_SELECTOR = '[data-visualization-viewer]';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function findViewerElement(root = document) {
  return root.querySelector(VIEWER_SELECTOR);
}

async function waitForPaint() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await sleep(16);
}

/**
 * Capture the visualization viewer as a canvas at the current paint.
 * @param {HTMLElement} [element]
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function captureViewerCanvas(element = findViewerElement()) {
  if (!element) {
    throw new Error('Visualization viewer not found');
  }
  await waitForPaint();
  return toCanvas(element, {
    pixelRatio: Math.min(2, window.devicePixelRatio || 1),
    cacheBust: true,
    backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
  });
}

/**
 * Step through each cursor (1..total), capture the viewer, return ImageData frames.
 * @param {{
 *   total: number,
 *   goTo: (cursor: number) => void,
 *   delayMs?: number,
 *   onProgress?: (done: number, total: number) => void,
 * }} options
 * @returns {Promise<ImageData[]>}
 */
export async function captureFrameSequence({
  total,
  goTo,
  delayMs = 50,
  onProgress,
}) {
  if (!total || total < 1) {
    throw new Error('Nothing to export');
  }

  const frames = [];
  for (let cursor = 1; cursor <= total; cursor += 1) {
    goTo(cursor);
    await sleep(delayMs);
    const canvas = await captureViewerCanvas();
    const ctx = canvas.getContext('2d');
    frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (onProgress) onProgress(cursor, total);
  }
  return frames;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Encode captured ImageData frames as a GIF and trigger download.
 * @param {ImageData[]} frames
 * @param {{ delayMs?: number, filename?: string }} [options]
 */
export async function encodeAndDownloadGif(frames, {
  delayMs = 100,
  filename = 'algorithm-visualizer.gif',
} = {}) {
  if (!frames.length) {
    throw new Error('No frames to encode');
  }

  const { width, height } = frames[0];
  const gif = GIFEncoder();

  frames.forEach((imageData, index) => {
    const palette = quantize(imageData.data, 256);
    const indexMap = applyPalette(imageData.data, palette);
    gif.writeFrame(indexMap, width, height, {
      palette,
      delay: delayMs,
      first: index === 0,
    });
  });

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([bytes], { type: 'image/gif' });
  downloadBlob(blob, filename);
}

/**
 * Record canvases into a WebM via MediaRecorder and trigger download.
 * @param {ImageData[]} frames
 * @param {{ fps?: number, filename?: string }} [options]
 */
export async function encodeAndDownloadWebM(frames, {
  fps = 10,
  filename = 'algorithm-visualizer.webm',
} = {}) {
  if (!frames.length) {
    throw new Error('No frames to encode');
  }
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('WebM export is not supported in this browser');
  }

  const { width, height } = frames[0];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const stream = canvas.captureStream(0);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : '';
  if (!mimeType) {
    throw new Error('WebM MediaRecorder is not available');
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000 });
  const stopped = new Promise((resolve, reject) => {
    recorder.ondataavailable = event => {
      if (event.data && event.data.size) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error('WebM recording failed'));
    recorder.onstop = () => resolve();
  });

  recorder.start();
  const frameDelay = Math.max(16, Math.round(1000 / fps));
  const [track] = stream.getVideoTracks();

  for (let i = 0; i < frames.length; i += 1) {
    ctx.putImageData(frames[i], 0, 0);
    if (track && typeof track.requestFrame === 'function') {
      track.requestFrame();
    }
    await sleep(frameDelay);
  }

  recorder.stop();
  await stopped;
  stream.getTracks().forEach(mediaTrack => mediaTrack.stop());

  const blob = new Blob(chunks, { type: 'video/webm' });
  downloadBlob(blob, filename);
}
