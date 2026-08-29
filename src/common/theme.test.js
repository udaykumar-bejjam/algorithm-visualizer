import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  applyDocumentTheme,
  getDocumentTheme,
  getThemeColors,
  normalizeTheme,
  THEME_DARK,
  THEME_LIGHT,
  colorFont,
  themes,
} from './theme';

describe('theme helpers', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('normalizes unknown themes to dark', () => {
    expect(normalizeTheme('light')).toBe(THEME_LIGHT);
    expect(normalizeTheme('dark')).toBe(THEME_DARK);
    expect(normalizeTheme('nope')).toBe(THEME_DARK);
  });

  it('applies data-theme on the document element', () => {
    applyDocumentTheme(THEME_LIGHT);
    expect(getDocumentTheme()).toBe(THEME_LIGHT);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('returns palette tokens for each theme', () => {
    expect(getThemeColors(THEME_LIGHT).colorFont).toBe(themes.light.colorFont);
    expect(getThemeColors(THEME_DARK).aceTheme).toBe('tomorrow_night_eighties');
    expect(getThemeColors(THEME_LIGHT).aceTheme).toBe('chrome');
  });

  it('keeps dark static exports for chart defaults', () => {
    expect(colorFont).toMatch(/^#/);
    expect(colorFont).toBe(themes.dark.colorFont);
  });
});
