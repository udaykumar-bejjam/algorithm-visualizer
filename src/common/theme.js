export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

export const themes = {
  [THEME_DARK]: {
    themeDark: '#242424',
    themeNormal: '#393939',
    themeLight: '#505050',
    colorFont: '#c8c8c8',
    colorShadow: 'rgba(0,0,0,.2)',
    colorOverlay: 'rgba(255,255,255,.1)',
    colorAlert: '#f3bd58',
    colorSelected: '#2962ff',
    colorPatched: '#c51162',
    colorHighlight: '#2299dd',
    colorActive: '#00e676',
    chartGrid: 'rgba(255,255,255,0.08)',
    aceTheme: 'tomorrow_night_eighties',
    seriesColors: ['#ffffff', '#00e676', '#2962ff', '#f44336', '#ffeb3b', '#00bcd4'],
  },
  [THEME_LIGHT]: {
    themeDark: '#ffffff',
    themeNormal: '#e8ebf0',
    themeLight: '#cfd5de',
    colorFont: '#1f2937',
    colorShadow: 'rgba(15,23,42,.12)',
    colorOverlay: 'rgba(15,23,42,.06)',
    colorAlert: '#a16207',
    colorSelected: '#1d4ed8',
    colorPatched: '#9d174d',
    colorHighlight: '#0369a1',
    colorActive: '#059669',
    chartGrid: 'rgba(15,23,42,0.08)',
    aceTheme: 'chrome',
    seriesColors: ['#111827', '#059669', '#1d4ed8', '#dc2626', '#ca8a04', '#0891b2'],
  },
};

/** Dark-theme constants kept for callers/tests that import static tokens. */
export const themeDark = themes.dark.themeDark;
export const themeNormal = themes.dark.themeNormal;
export const themeLight = themes.dark.themeLight;
export const colorFont = themes.dark.colorFont;
export const colorShadow = themes.dark.colorShadow;
export const colorOverlay = themes.dark.colorOverlay;
export const colorAlert = themes.dark.colorAlert;
export const colorSelected = themes.dark.colorSelected;
export const colorPatched = themes.dark.colorPatched;
export const colorHighlight = themes.dark.colorHighlight;
export const colorActive = themes.dark.colorActive;
export const seriesColors = themes.dark.seriesColors;

export function normalizeTheme(theme) {
  return theme === THEME_LIGHT ? THEME_LIGHT : THEME_DARK;
}

export function getDocumentTheme() {
  if (typeof document === 'undefined') return THEME_DARK;
  const attr = document.documentElement.getAttribute('data-theme');
  return normalizeTheme(attr);
}

export function getThemeColors(theme = getDocumentTheme()) {
  return themes[normalizeTheme(theme)];
}

export function applyDocumentTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', normalizeTheme(theme));
}
