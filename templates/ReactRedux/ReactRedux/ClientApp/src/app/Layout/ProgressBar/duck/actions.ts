import * as types from './types';

export const clearProgressBar = (): types.ProgressBarActionTypes => {
    return {
        type: types.CLEAR
    };
}
export const setProgressBarState = (state: Partial<types.ProgressBarState>): types.ProgressBarActionTypes => {
    return {
        type: types.SET_STATE,
        state
    };
}