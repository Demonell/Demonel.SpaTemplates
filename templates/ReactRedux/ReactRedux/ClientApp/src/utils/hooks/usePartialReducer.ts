import { useReducer } from 'react';
// import logger from 'use-reducer-logger';

export function usePartialReducer<T>(initialState: T) {
    const reducer = (state: T, newState: Partial<T>) => ({ ...state, ...newState });
    // const reducer = logger((state: T, newState: Partial<T>) => ({ ...state, ...newState }));
    return useReducer(
        reducer,
        initialState
    );
}