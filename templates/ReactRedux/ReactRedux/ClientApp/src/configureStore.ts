import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ApplicationState, reducers } from './store';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { history } from '.';

export default function configureStore(initialState?: ApplicationState) {
    const middleware = [
        routerMiddleware(history),
        thunk
    ];

    const rootReducer = combineReducers({
        router: connectRouter(history),
        ...reducers
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}
