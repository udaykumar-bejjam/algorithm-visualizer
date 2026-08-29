import Cookies from 'js-cookie';
import { combineActions, createAction, handleActions } from 'redux-actions';

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

export const actions = {
  setExt,
  setUser,
  setAutoBuild,
  setSoundEnabled,
};

const defaultState = {
  ext: Cookies.get('ext') || 'js',
  user: undefined,
  autoBuild: Cookies.get('autoBuild') !== '0',
  soundEnabled: Cookies.get('soundEnabled') === '1',
};

export default handleActions({
  [combineActions(
    setExt,
    setUser,
    setAutoBuild,
    setSoundEnabled,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
