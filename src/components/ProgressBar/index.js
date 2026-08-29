import React from 'react';
import { classes } from 'common/util';
import styles from './ProgressBar.module.scss';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  handleMouseDown(e) {
    this.target = e.target;
    this.handleMouseMove(e);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    const { left } = this.target.getBoundingClientRect();
    const { offsetWidth } = this.target;
    const { onChangeProgress } = this.props;
    const progress = (e.clientX - left) / offsetWidth;
    if (onChangeProgress) onChangeProgress(progress);
  }

  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleDoubleClick(e) {
    const { left } = e.currentTarget.getBoundingClientRect();
    const { offsetWidth } = e.currentTarget;
    const { onToggleBreakpoint } = this.props;
    const progress = (e.clientX - left) / offsetWidth;
    if (onToggleBreakpoint) onToggleBreakpoint(progress);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { className, total, current, breakpoints = [] } = this.props;
    const percent = total > 0 ? (current / total) * 100 : 0;

    return (
      <div
        className={classes(styles.progress_bar, className)}
        onMouseDown={this.handleMouseDown}
        onDoubleClick={this.handleDoubleClick}
        title="Drag to scrub. Double-click to toggle a breakpoint."
      >
        <div className={styles.active} style={{ width: `${percent}%` }} />
        {
          breakpoints.map(cursor => (
            <div
              key={cursor}
              className={styles.breakpoint}
              style={{ left: `${total > 0 ? (cursor / total) * 100 : 0}%` }}
            />
          ))
        }
        <div className={styles.label}>
          <span className={styles.current}>{current}</span> / {total}
        </div>
      </div>
    );
  }
}

export default ProgressBar;
