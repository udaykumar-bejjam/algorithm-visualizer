import React from 'react';
import ReactMarkdown from 'react-markdown';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import { Button } from 'components';
import { classes } from 'common/util';
import styles from './ApiReference.module.scss';

class ApiReference extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { className, markdown, onClose } = this.props;
    if (!markdown) return null;

    return (
      <div className={classes(styles.backdrop, className)} onClick={onClose} role="presentation">
        <div
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="API Reference"
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>API Reference</h2>
            <Button icon={faTimes} primary onClick={onClose}>Close</Button>
          </div>
          <div className={styles.body}>
            <ReactMarkdown className={styles.content} source={markdown} escapeHtml />
          </div>
        </div>
      </div>
    );
  }
}

export default ApiReference;
