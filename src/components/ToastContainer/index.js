import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'reducers';
import { classes } from 'common/util';
import styles from './ToastContainer.module.scss';

class ToastContainer extends React.Component {
  constructor(props) {
    super(props);
    this.hideTimeouts = {};
  }

  componentDidUpdate(prevProps) {
    const prevIds = new Set(prevProps.toast.toasts.map(toast => toast.id));
    const newToasts = this.props.toast.toasts.filter(toast => !prevIds.has(toast.id));
    newToasts.forEach(toast => {
      this.hideTimeouts[toast.id] = window.setTimeout(() => {
        delete this.hideTimeouts[toast.id];
        this.props.hideToast(toast.id);
      }, 3000);
    });
  }

  componentWillUnmount() {
    Object.keys(this.hideTimeouts).forEach(id => {
      window.clearTimeout(this.hideTimeouts[id]);
    });
    this.hideTimeouts = {};
  }

  render() {
    const { className } = this.props;
    const { toasts } = this.props.toast;

    return (
      <div className={classes(styles.toast_container, className)}>
        {
          toasts.map(toast => (
            <div className={classes(styles.toast, styles[toast.type])} key={toast.id}>
              {toast.message}
            </div>
          ))
        }
      </div>
    );
  }
}

export default connect(({ toast }) => ({ toast }), actions)(
  ToastContainer,
);
