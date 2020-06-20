import * as Oidc from 'redux-oidc';
import * as Auth from './app/Auth/duck';
import * as Snack from './app/Layout/Snack/duck';
import * as TableSettings from './app/Common/TableUniversal/TableSettings/duck';
import { RouterState } from 'connected-react-router';

// The top-level state object
export interface ApplicationState {
    router: RouterState | undefined;
    oidc: Oidc.UserState | undefined;
    auth: Auth.AuthState | undefined;
    snack: Snack.SnackState | undefined;
    tableSettings: TableSettings.TableSettingsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    oidc: Oidc.reducer,
    auth: Auth.reducer,
    snack: Snack.reducer,
    tableSettings: TableSettings.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction | AppThunkAction<TAction>) => void, getState: () => ApplicationState): void;
}
