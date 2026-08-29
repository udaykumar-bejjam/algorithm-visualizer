export const MOTION_ON = 'on';
export const MOTION_OFF = 'off';

export function normalizeMotionEnabled(value) {
  return value !== false && value !== '0' && value !== MOTION_OFF;
}

export function applyDocumentMotion(enabled) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(
    'data-motion',
    normalizeMotionEnabled(enabled) ? MOTION_ON : MOTION_OFF,
  );
}

export function isDocumentMotionEnabled() {
  if (typeof document === 'undefined') return true;
  if (document.documentElement.getAttribute('data-motion') === MOTION_OFF) {
    return false;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
  }
  return true;
}

/** Chart.js animation config respecting motion preferences. */
export function getChartAnimationOptions() {
  if (!isDocumentMotionEnabled()) return false;
  return {
    duration: 280,
    easing: 'easeOutQuart',
  };
}
