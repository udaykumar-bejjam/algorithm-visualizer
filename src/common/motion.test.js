import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  applyDocumentMotion,
  getChartAnimationOptions,
  isDocumentMotionEnabled,
  normalizeMotionEnabled,
} from './motion';

describe('motion helpers', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-motion');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-motion');
    vi.restoreAllMocks();
  });

  it('normalizes motion flags', () => {
    expect(normalizeMotionEnabled(true)).toBe(true);
    expect(normalizeMotionEnabled(false)).toBe(false);
    expect(normalizeMotionEnabled('0')).toBe(false);
    expect(normalizeMotionEnabled('off')).toBe(false);
  });

  it('applies data-motion on the document', () => {
    applyDocumentMotion(false);
    expect(document.documentElement.getAttribute('data-motion')).toBe('off');
    expect(isDocumentMotionEnabled()).toBe(false);
    applyDocumentMotion(true);
    expect(document.documentElement.getAttribute('data-motion')).toBe('on');
  });

  it('returns chart animation options when motion is on', () => {
    applyDocumentMotion(true);
    expect(getChartAnimationOptions()).toEqual({
      duration: 280,
      easing: 'easeOutQuart',
    });
    applyDocumentMotion(false);
    expect(getChartAnimationOptions()).toBe(false);
  });
});
