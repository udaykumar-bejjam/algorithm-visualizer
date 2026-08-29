import { describe, it, expect } from 'vitest';
import { colorFont, colorPatched, colorSelected, seriesColors } from '../../common/theme';

describe('chart theme tokens', () => {
  it('exposes colors used by Chart and Scatter renderers', () => {
    expect(colorFont).toMatch(/^#/);
    expect(colorSelected).toMatch(/^#/);
    expect(colorPatched).toMatch(/^#/);
    expect(seriesColors.length).toBeGreaterThanOrEqual(3);
  });
});
