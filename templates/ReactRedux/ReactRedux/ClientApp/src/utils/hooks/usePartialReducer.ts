import { useReducer } from 'react';

export function usePartialReducer<T>(initialState: T) {
    return useReducer(
        (state: T, newState: Partial<T>) => ({ ...state, ...newState }),
        initialState
    );
}