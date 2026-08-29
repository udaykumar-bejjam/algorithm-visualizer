import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'PLAYER';

const setChunks = createAction(`${prefix}/SET_CHUNKS`, chunks => ({ chunks }));
const setCursor = createAction(`${prefix}/SET_CURSOR`, cursor => ({ cursor }));
const setLineIndicator = createAction(`${prefix}/SET_LINE_INDICATOR`, lineIndicator => ({ lineIndicator }));
const setCommands = createAction(`${prefix}/SET_COMMANDS`, commands => ({ commands }));
const toggleBreakpoint = createAction(`${prefix}/TOGGLE_BREAKPOINT`, cursor => ({ cursor }));

export const actions = {
  setChunks,
  setCursor,
  setLineIndicator,
  setCommands,
  toggleBreakpoint,
};

const defaultState = {
  chunks: [],
  cursor: 0,
  lineIndicator: undefined,
  commands: [],
  breakpoints: [],
};

export default handleActions({
  [combineActions(
    setChunks,
    setCursor,
    setLineIndicator,
    setCommands,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [toggleBreakpoint]: (state, { payload }) => {
    const { cursor } = payload;
    const exists = state.breakpoints.includes(cursor);
    return {
      ...state,
      breakpoints: exists
        ? state.breakpoints.filter(value => value !== cursor)
        : [...state.breakpoints, cursor].sort((a, b) => a - b),
    };
  },
}, defaultState);
