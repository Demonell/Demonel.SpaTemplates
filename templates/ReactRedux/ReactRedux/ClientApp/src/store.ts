import * as Oidc from 'redux-oidc';
import * as Auth from './app/Auth/duck';
import * as Snack from './app/Layout/Snack/duck';
import * as UniversalTable from './app/Common/UniversalTable/duck';

// The top-level state object
export interface ApplicationState {
    oidc: Oidc.UserState | undefined;
    auth: Auth.AuthState | undefined;
    snack: Snack.SnackState | undefined;
    universalTable: UniversalTable.UniversalTableState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    oidc: Oidc.reducer,
    auth: Auth.reducer,
    snack: Snack.reducer,
    universalTable: UniversalTable.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction | AppThunkAction<TAction>) => void, getState: () => ApplicationState): void;
}
