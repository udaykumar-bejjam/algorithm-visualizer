import Cookies from 'js-cookie';
import { combineActions, createAction, handleActions } from 'redux-actions';
import { applyDocumentTheme, normalizeTheme, THEME_DARK } from 'common/theme';
import { applyDocumentMotion, normalizeMotionEnabled } from 'common/motion';

const prefix = 'ENV';

const setExt = createAction(`${prefix}/SET_EXT`, ext => {
  Cookies.set('ext', ext);
  return { ext };
});
const setUser = createAction(`${prefix}/SET_USER`, user => ({ user }));
const setAutoBuild = createAction(`${prefix}/SET_AUTO_BUILD`, autoBuild => {
  Cookies.set('autoBuild', autoBuild ? '1' : '0');
  return { autoBuild };
});
const setSoundEnabled = createAction(`${prefix}/SET_SOUND_ENABLED`, soundEnabled => {
  Cookies.set('soundEnabled', soundEnabled ? '1' : '0');
  return { soundEnabled };
});
const setTheme = createAction(`${prefix}/SET_THEME`, theme => {
  const next = normalizeTheme(theme);
  Cookies.set('theme', next);
  applyDocumentTheme(next);
  return { theme: next };
});
const setMotionEnabled = createAction(`${prefix}/SET_MOTION_ENABLED`, motionEnabled => {
  const next = normalizeMotionEnabled(motionEnabled);
  Cookies.set('motionEnabled', next ? '1' : '0');
  applyDocumentMotion(next);
  return { motionEnabled: next };
});

export const actions = {
  setExt,
  setUser,
  setAutoBuild,
  setSoundEnabled,
  setTheme,
  setMotionEnabled,
};

const initialTheme = normalizeTheme(Cookies.get('theme') || THEME_DARK);
applyDocumentTheme(initialTheme);

const initialMotion = Cookies.get('motionEnabled') !== '0';
applyDocumentMotion(initialMotion);

const defaultState = {
  ext: Cookies.get('ext') || 'js',
  user: undefined,
  autoBuild: Cookies.get('autoBuild') !== '0',
  soundEnabled: Cookies.get('soundEnabled') === '1',
  theme: initialTheme,
  motionEnabled: initialMotion,
};

export default handleActions({
  [combineActions(
    setExt,
    setUser,
    setAutoBuild,
    setSoundEnabled,
    setTheme,
    setMotionEnabled,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
