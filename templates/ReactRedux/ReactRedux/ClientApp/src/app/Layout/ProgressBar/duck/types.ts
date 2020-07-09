export interface ProgressBarState {
    id: string;
    inProgress: boolean;
    progress: number;
    skippedTicks: number;
};

export const CLEAR = 'PROGRESS_BAR/CLEAR';
export const SET_STATE = 'PROGRESS_BAR/SET_STATE';

export interface ClearAction {
    type: typeof CLEAR;
}

export interface SetStateAction {
    type: typeof SET_STATE;
    state: Partial<ProgressBarState>;
}

export type ProgressBarActionTypes =
    ClearAction
    | SetStateAction;