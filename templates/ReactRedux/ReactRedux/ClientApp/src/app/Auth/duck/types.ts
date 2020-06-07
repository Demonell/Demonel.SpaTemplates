export interface AuthState {
    userInfo: UserInfo;
};

export interface UserInfo {
    sub: string;
    securityStamp: string;
    preferred_username: string;
    email: string;
    email_verified: boolean;
    name: string;
    roles: string[];
    claims: string[];
}

export const SET_STATE = 'AUTH/SET_STATE';

export interface SetStateAction {
    type: typeof SET_STATE;
    state: Partial<AuthState>;
}

export type UserInfoActionTypes =
    SetStateAction;