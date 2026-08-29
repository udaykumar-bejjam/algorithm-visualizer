import { describe, it, expect } from 'vitest';
import { MOBILE_PANES, visiblesForMobilePane } from './MobilePaneBar';

describe('visiblesForMobilePane', () => {
  it('shows only the selected pane', () => {
    expect(visiblesForMobilePane('navigator')).toEqual([true, false, false]);
    expect(visiblesForMobilePane('visualization')).toEqual([false, true, false]);
    expect(visiblesForMobilePane('editor')).toEqual([false, false, true]);
  });

  it('aligns with MOBILE_PANES order', () => {
    expect(MOBILE_PANES.map(pane => pane.id)).toEqual([
      'navigator',
      'visualization',
      'editor',
    ]);
  });
});
