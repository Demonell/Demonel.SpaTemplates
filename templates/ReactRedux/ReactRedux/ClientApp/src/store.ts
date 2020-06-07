import * as Oidc from 'redux-oidc';
import * as Auth from './app/Auth/duck';
import * as Snack from './app/Snack/duck';
import * as WeatherForecasts from './store/WeatherForecasts';
import * as Counter from './store/Counter';

// The top-level state object
export interface ApplicationState {
    oidc: Oidc.UserState | undefined;
    auth: Auth.AuthState | undefined;
    snack: Snack.SnackState | undefined;
    counter: Counter.CounterState | undefined;
    weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    oidc: Oidc.reducer,
    auth: Auth.reducer,
    snack: Snack.reducer,
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction | AppThunkAction<TAction>) => void, getState: () => ApplicationState): void;
}
