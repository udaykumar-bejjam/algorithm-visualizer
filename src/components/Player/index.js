import React from 'react';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import axios from 'axios';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import { classes, extension, chunkCommands, validateCommands } from 'common/util';
import {
  captureFrameSequence,
  encodeAndDownloadGif,
  encodeAndDownloadWebM,
} from 'common/exportMedia';
import { TracerApi } from 'apis';
import { actions } from 'reducers';
import { BaseComponent, Button, ProgressBar } from 'components';
import styles from './Player.module.scss';

const BUILDABLE_EXTS = ['md', 'js', 'cpp', 'java', 'json'];
const AUTO_BUILD_DELAY_MS = 800;

class Player extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      speed: 2,
      playing: false,
      building: false,
      exporting: false,
      exportMenuOpen: false,
    };

    this.tracerApiSource = null;
    this.buildTimer = null;
    this.audioContext = null;

    this.reset();
  }

  componentDidMount() {
    const { editingFile, shouldBuild } = this.props.current;
    if (shouldBuild) this.build(editingFile);
  }

  componentWillUnmount() {
    this.pause();
    this.clearBuildTimer();
    if (this.tracerApiSource) {
      this.tracerApiSource.cancel();
      this.tracerApiSource = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  componentDidUpdate(prevProps) {
    const { editingFile, shouldBuild } = this.props.current;
    const { autoBuild } = this.props.env;
    const prevFile = prevProps.current.editingFile;

    if (editingFile !== prevFile) {
      this.clearBuildTimer();
      if (shouldBuild) this.build(editingFile);
      return;
    }

    if (
      autoBuild &&
      shouldBuild &&
      editingFile &&
      prevFile &&
      editingFile.content !== prevFile.content &&
      BUILDABLE_EXTS.includes(extension(editingFile.name))
    ) {
      this.scheduleBuild(editingFile);
    }
  }

  clearBuildTimer() {
    if (this.buildTimer) {
      window.clearTimeout(this.buildTimer);
      this.buildTimer = null;
    }
  }

  scheduleBuild(file) {
    this.clearBuildTimer();
    this.buildTimer = window.setTimeout(() => {
      this.buildTimer = null;
      this.build(file);
    }, AUTO_BUILD_DELAY_MS);
  }

  reset(commands = []) {
    const chunks = chunkCommands(commands);
    this.props.setCommands(commands.slice ? commands.slice() : [...commands]);
    this.props.setChunks(chunks);
    this.props.setCursor(0);
    this.pause();
    this.props.setLineIndicator(undefined);
  }

  build(file) {
    this.clearBuildTimer();
    this.reset();
    if (!file) return;

    if (this.tracerApiSource) this.tracerApiSource.cancel();
    this.tracerApiSource = axios.CancelToken.source();
    this.setState({ building: true });

    const ext = extension(file.name);
    if (ext in TracerApi) {
      TracerApi[ext]({ code: file.content }, undefined, this.tracerApiSource.token)
        .then(commands => {
          this.tracerApiSource = null;
          this.setState({ building: false });
          const list = validateCommands(Array.isArray(commands) ? commands : []);
          this.reset(list);
          this.next();
        })
        .catch(error => {
          if (axios.isCancel(error)) return;
          this.tracerApiSource = null;
          this.setState({ building: false });
          this.handleError(error);
        });
    } else {
      this.setState({ building: false });
      this.handleError(new Error('Language Not Supported'));
    }
  }

  isValidCursor(cursor) {
    const { chunks } = this.props.player;
    return 1 <= cursor && cursor <= chunks.length;
  }

  playTick() {
    if (!this.props.env.soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioContext) this.audioContext = new AudioContext();
      const ctx = this.audioContext;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 660;
      gain.gain.value = 0.03;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // ignore audio failures
    }
  }

  prev() {
    this.pause();
    const cursor = this.props.player.cursor - 1;
    if (!this.isValidCursor(cursor)) return false;
    this.props.setCursor(cursor);
    this.playTick();
    return true;
  }

  resume(wrap = false) {
    this.pause();
    let advanced = this.next();
    if (!advanced && wrap && this.isValidCursor(1)) {
      this.props.setCursor(1);
      advanced = true;
      this.playTick();
    }
    if (!advanced) return;

    const { cursor, breakpoints } = this.props.player;
    if (breakpoints.includes(cursor)) {
      return;
    }

    const interval = 4000 / Math.pow(Math.E, this.state.speed);
    this.timer = window.setTimeout(() => this.resume(), interval);
    this.setState({ playing: true });
  }

  pause() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.state.playing) {
      this.setState({ playing: false });
    }
  }

  next() {
    this.pause();
    const cursor = this.props.player.cursor + 1;
    if (!this.isValidCursor(cursor)) return false;
    this.props.setCursor(cursor);
    this.playTick();
    return true;
  }

  handleChangeSpeed(speed) {
    this.setState({ speed });
  }

  handleChangeProgress(progress) {
    const { chunks } = this.props.player;
    const cursor = Math.max(1, Math.min(chunks.length, Math.round(progress * chunks.length)));
    this.pause();
    this.props.setCursor(cursor);
  }

  handleToggleBreakpoint(progress) {
    const { chunks } = this.props.player;
    if (!chunks.length) return;
    const cursor = Math.max(1, Math.min(chunks.length, Math.round(progress * chunks.length)));
    this.props.toggleBreakpoint(cursor);
  }

  exportCommands() {
    const { commands } = this.props.player;
    if (!commands || !commands.length) {
      this.handleError(new Error('Nothing to export. Build a visualization first.'));
      return;
    }
    this.setState({ exportMenuOpen: false });
    const blob = new Blob([JSON.stringify(commands, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'visualization.json';
    anchor.click();
    URL.revokeObjectURL(url);
    this.props.showSuccessToast('Exported visualization.json');
  }

  toggleExportMenu() {
    this.setState(state => ({ exportMenuOpen: !state.exportMenuOpen }));
  }

  async exportMedia(format) {
    const { chunks, cursor } = this.props.player;
    if (!chunks.length) {
      this.handleError(new Error('Nothing to export. Build a visualization first.'));
      return;
    }
    if (this.state.exporting) return;

    this.pause();
    this.setState({ exporting: format, exportMenuOpen: false });
    const previousCursor = cursor;

    try {
      const interval = 4000 / Math.pow(Math.E, this.state.speed);
      const frames = await captureFrameSequence({
        total: chunks.length,
        goTo: nextCursor => this.props.setCursor(nextCursor),
        delayMs: Math.min(120, Math.max(40, interval / 8)),
      });

      if (format === 'gif') {
        await encodeAndDownloadGif(frames, { delayMs: Math.round(interval) });
        this.props.showSuccessToast('Exported algorithm-visualizer.gif');
      } else {
        await encodeAndDownloadWebM(frames, {
          fps: Math.max(2, Math.min(20, Math.round(1000 / interval))),
        });
        this.props.showSuccessToast('Exported algorithm-visualizer.webm');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.props.setCursor(previousCursor);
      this.setState({ exporting: false });
    }
  }

  render() {
    const { className } = this.props;
    const { editingFile } = this.props.current;
    const { chunks, cursor, breakpoints } = this.props.player;
    const { speed, playing, building, exporting, exportMenuOpen } = this.state;
    const busy = building || Boolean(exporting);

    return (
      <div className={classes(styles.player, className)}>
        <Button icon={faWrench} primary disabled={busy} inProgress={building}
                onClick={() => this.build(editingFile)}>
          {building ? 'Building' : 'Build'}
        </Button>
        {
          playing ? (
            <Button icon={faPause} primary active onClick={() => this.pause()}>Pause</Button>
          ) : (
            <Button icon={faPlay} primary disabled={busy} onClick={() => this.resume(true)}>Play</Button>
          )
        }
        <Button icon={faChevronLeft} primary disabled={busy || !this.isValidCursor(cursor - 1)} onClick={() => this.prev()}/>
        <ProgressBar className={styles.progress_bar} current={cursor} total={chunks.length}
                     breakpoints={breakpoints}
                     onChangeProgress={progress => this.handleChangeProgress(progress)}
                     onToggleBreakpoint={progress => this.handleToggleBreakpoint(progress)}/>
        <Button icon={faChevronRight} reverse primary disabled={busy || !this.isValidCursor(cursor + 1)}
                onClick={() => this.next()}/>
        <div className={styles.export}>
          <Button
            icon={faDownload}
            primary
            disabled={busy}
            inProgress={Boolean(exporting)}
            onClick={() => this.toggleExportMenu()}
          >
            {exporting === 'gif' ? 'GIF…' : exporting === 'webm' ? 'WebM…' : 'Export'}
          </Button>
          {exportMenuOpen && !exporting && (
            <div className={styles.export_menu} role="menu">
              <button type="button" role="menuitem" onClick={() => this.exportCommands()}>
                JSON commands
              </button>
              <button type="button" role="menuitem" onClick={() => this.exportMedia('gif')}>
                GIF animation
              </button>
              <button type="button" role="menuitem" onClick={() => this.exportMedia('webm')}>
                WebM video
              </button>
            </div>
          )}
        </div>
        <div className={styles.speed}>
          Speed
          <InputRange
            classNames={{
              inputRange: styles.range,
              labelContainer: styles.range_label_container,
              slider: styles.range_slider,
              track: styles.range_track,
            }} minValue={0} maxValue={4} step={.5} value={speed}
            onChange={speed => this.handleChangeSpeed(speed)}/>
        </div>
      </div>
    );
  }
}

export default connect(({ current, player, env }) => ({ current, player, env }), actions)(
  Player,
);
