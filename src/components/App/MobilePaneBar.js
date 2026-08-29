import { classes } from 'common/util';
import styles from './MobilePaneBar.module.scss';

export const MOBILE_PANES = [
  { id: 'navigator', label: 'Algorithms' },
  { id: 'visualization', label: 'Visualize' },
  { id: 'editor', label: 'Code' },
];

export function visiblesForMobilePane(pane) {
  return MOBILE_PANES.map(item => item.id === pane);
}

function MobilePaneBar({ activePane, onChange }) {
  return (
    <nav className={styles.mobile_pane_bar} role="tablist" aria-label="Workspace panes">
      {MOBILE_PANES.map(pane => {
        const selected = pane.id === activePane;
        return (
          <button
            key={pane.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={classes(styles.tab, selected && styles.selected)}
            onClick={() => onChange(pane.id)}
          >
            {pane.label}
          </button>
        );
      })}
    </nav>
  );
}

export default MobilePaneBar;
