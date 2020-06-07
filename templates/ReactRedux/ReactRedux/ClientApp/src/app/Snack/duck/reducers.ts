import * as types from './types';
import { Reducer } from 'redux';

const initialState: types.SnackState = {
    opened: false,
    message: '',
    snackType: 'success'
};

export const reducer: Reducer<types.SnackState, types.SnackActionTypes> = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case types.OPEN:
            return {
                ...state,
                opened: true,
                snackType: action.snackType,
                message: action.message,
                onUndo: action.onUndo
            };
        case types.CLOSE:
            return {
                ...state,
                opened: false
            };
        default:
            return state;
    }
}