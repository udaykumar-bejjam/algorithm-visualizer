import * as TracerClasses from 'core/tracers';
import * as LayoutClasses from 'core/layouts';

const isLayoutType = type => type in LayoutClasses;
const isTracerType = type => type in TracerClasses;

export const captureFrame = (objects, root) => {
  const objectStates = Object.keys(objects).map((key) => {
    const object = objects[key];
    if (!object || typeof object.captureState !== 'function') return null;
    return object.captureState();
  }).filter(Boolean);

  return {
    rootKey: root ? root.key : null,
    objectStates,
  };
};

export const restoreFrame = (frame, getObject) => {
  const objects = {};
  const resolve = key => objects[key];

  (frame.objectStates || []).forEach((state) => {
    const { type, key, title, childKeys } = state;
    if (isLayoutType(type)) {
      const LayoutClass = LayoutClasses[type];
      objects[key] = new LayoutClass(key, resolve, childKeys || []);
    } else if (isTracerType(type)) {
      const TracerClass = TracerClasses[type];
      objects[key] = new TracerClass(key, resolve, title || type);
    }
  });

  (frame.objectStates || []).forEach((state) => {
    const object = objects[state.key];
    if (object && typeof object.restoreState === 'function') {
      object.restoreState(state);
    }
  });

  // Re-link layout children after all objects exist / restored
  (frame.objectStates || []).forEach((state) => {
    if (!isLayoutType(state.type)) return;
    const layout = objects[state.key];
    if (layout) layout.restoreState(state);
  });

  const root = frame.rootKey != null ? objects[frame.rootKey] : null;
  return { objects, root };
};

export const applyChunksFromStart = (chunks, cursor, applyChunk, reset) => {
  reset();
  chunks.slice(0, cursor).forEach(chunk => applyChunk(chunk));
};
