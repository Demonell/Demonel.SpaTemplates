import { useReducer } from 'react';

export function usePartialReducer<T>(initialState: T) {
    return useReducer(
        (state: T, newState: Partial<T>) => {
            // console.log({newState});
            return { ...state, ...newState };
        },
        initialState
    );
}