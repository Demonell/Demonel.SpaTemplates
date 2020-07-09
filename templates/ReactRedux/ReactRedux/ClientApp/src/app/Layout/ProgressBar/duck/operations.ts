import { AppThunkAction } from "../../../../store";
import { setProgressBarState } from "./actions";
import { ProgressBarActionTypes } from "./types";
import { store } from "../../../..";

let loadId = 0;
export const beginLoading = (): number => {
    loadId++;
    store.dispatch(setProgressBarState({ progress: 0, skippedTicks: 0, inProgress: true }));
    return loadId;
}

export const stopLoading = (id: number): void => {
    if (loadId === id) {
        store.dispatch(setProgressBarState({ progress: 100 }));

        // let bar stays at 100% for some time just for effect
        setTimeout(() => store.dispatch(setProgressBarState({ inProgress: false })), 300);
    }
}

export const SkipTicks = 2;
export const makeProgressTick = (): AppThunkAction<ProgressBarActionTypes> => (dispatch, getState) => {
    const state = getState().progressBar!;
    if (state.skippedTicks < SkipTicks) {
        dispatch(setProgressBarState({ skippedTicks: state.skippedTicks + 1 }));
    } else if (state.progress < 100) {
        const diff = Math.min(Math.random() * 10, (95 - state.progress) / 10);
        dispatch(setProgressBarState({ progress: Math.min(state.progress + diff, 95) }));
    }
}