import * as types from './types';
import { AuthState } from '.';

export const setUserInfoState = (state: Partial<AuthState>): types.UserInfoActionTypes => {
    return {
        type: types.SET_STATE,
        state
    };
}
