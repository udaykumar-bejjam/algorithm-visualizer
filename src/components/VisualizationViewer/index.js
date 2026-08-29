import React from 'react';
import { connect } from 'react-redux';
import { BaseComponent } from 'components';
import { actions } from 'reducers';
import styles from './VisualizationViewer.module.scss';
import * as TracerClasses from 'core/tracers';
import * as LayoutClasses from 'core/layouts';
import { classes } from 'common/util';
import { captureFrame, restoreFrame } from 'core/frames';

class VisualizationViewer extends BaseComponent {
  constructor(props) {
    super(props);

    this.frameCache = new Map();
    this.fadeRef = React.createRef();
    this.reset();
  }

  reset() {
    this.root = null;
    this.objects = {};
  }

  clearFrameCache() {
    this.frameCache = new Map();
  }

  componentDidMount() {
    const { chunks, cursor } = this.props.player;
    this.update(chunks, cursor);
  }

  triggerChunkMotion() {
    if (!this.props.motionEnabled) return;
    const el = this.fadeRef.current;
    if (!el) return;
    el.classList.remove(styles.pulse);
    // Force reflow so the chunk-ease animation can restart.
    void el.offsetWidth;
    el.classList.add(styles.pulse);
  }

  componentDidUpdate(prevProps) {
    const { chunks, cursor } = this.props.player;
    const { chunks: oldChunks, cursor: oldCursor } = prevProps.player;
    if (this.props.theme !== prevProps.theme) {
      this.forceUpdate();
    }
    if (chunks !== oldChunks) {
      this.clearFrameCache();
      this.update(chunks, cursor, [], 0);
      this.triggerChunkMotion();
      return;
    }
    if (cursor !== oldCursor) {
      this.update(chunks, cursor, oldChunks, oldCursor);
      this.triggerChunkMotion();
    }
  }

  cacheCurrentFrame(cursor) {
    this.frameCache.set(cursor, captureFrame(this.objects, this.root));
  }

  tryRestoreFrame(cursor) {
    if (!this.frameCache.has(cursor)) return false;
    const frame = this.frameCache.get(cursor);
    const { objects, root } = restoreFrame(frame);
    this.objects = objects;
    this.root = root;
    return true;
  }

  update(chunks, cursor, oldChunks = [], oldCursor = 0) {
    if (cursor === oldCursor && oldChunks === chunks) {
      return;
    }

    // Prefer immutable snapshots when scrubbing backward or jumping to a known frame.
    if (cursor !== oldCursor + 1 && this.tryRestoreFrame(cursor)) {
      this.updateLineIndicator(chunks, cursor);
      this.forceUpdate();
      return;
    }

    if (cursor > oldCursor && oldChunks === chunks) {
      for (let nextCursor = oldCursor + 1; nextCursor <= cursor; nextCursor += 1) {
        this.applyChunk(chunks[nextCursor - 1]);
        this.cacheCurrentFrame(nextCursor);
      }
    } else {
      this.reset();
      for (let nextCursor = 1; nextCursor <= cursor; nextCursor += 1) {
        this.applyChunk(chunks[nextCursor - 1]);
        this.cacheCurrentFrame(nextCursor);
      }
    }

    this.updateLineIndicator(chunks, cursor);
    this.forceUpdate();
  }

  updateLineIndicator(chunks, cursor) {
    const lastChunk = cursor > 0 ? chunks[cursor - 1] : undefined;
    if (lastChunk && lastChunk.lineNumber !== undefined) {
      this.props.setLineIndicator({ lineNumber: lastChunk.lineNumber, cursor });
    } else {
      this.props.setLineIndicator(undefined);
    }
  }

  applyCommand(command) {
    const { key, method, args } = command;
    try {
      if (key === null && method === 'setRoot') {
        const [root] = args;
        this.root = this.objects[root];
      } else if (method === 'destroy') {
        delete this.objects[key];
      } else if (method in LayoutClasses) {
        const [children] = args;
        const LayoutClass = LayoutClasses[method];
        this.objects[key] = new LayoutClass(key, objectKey => this.objects[objectKey], children);
      } else if (method in TracerClasses) {
        const className = method;
        const [title = className] = args;
        const TracerClass = TracerClasses[className];
        this.objects[key] = new TracerClass(key, objectKey => this.objects[objectKey], title);
      } else {
        this.objects[key][method](...args);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  applyChunk(chunk) {
    if (!chunk) return;
    chunk.commands.forEach(command => this.applyCommand(command));
  }

  render() {
    const { className } = this.props;

    return (
      <div
        className={classes(styles.visualization_viewer, className)}
        data-visualization-viewer
      >
        <div className={styles.fade} ref={this.fadeRef}>
          {
            this.root && this.root.render()
          }
        </div>
      </div>
    );
  }
}

export default connect(({ player, env }) => ({
  player,
  theme: env.theme,
  motionEnabled: env.motionEnabled,
}), actions)(
  VisualizationViewer,
);
