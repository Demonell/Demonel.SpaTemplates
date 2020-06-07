import * as types from './types';
import { Reducer } from 'redux';

export const initialState: types.AuthState = {
    userInfo: {
        sub: '',
        securityStamp: '',
        preferred_username: '',
        email: '',
        email_verified: false,
        name: '',
        roles: [],
        claims: []
    }
};

export const reducer: Reducer<types.AuthState, types.UserInfoActionTypes> = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case types.SET_STATE:
            return {
                ...state,
                ...action.state
            }
        default:
            return state;
    }
}