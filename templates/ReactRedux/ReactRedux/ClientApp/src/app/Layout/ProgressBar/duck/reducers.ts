import * as types from './types';
import { Reducer } from 'redux';

const initialState: types.ProgressBarState = {
    id: '',
    inProgress: false,
    progress: 100,
    skippedTicks: 0
};

export const reducer: Reducer<types.ProgressBarState, types.ProgressBarActionTypes> = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case types.CLEAR:
            return initialState;
        case types.SET_STATE:
            return {
                ...state,
                ...action.state
            };
        default:
            return state;
    }
}