import { AppThunkAction, ApplicationState } from "../../../../store";
import { SnackActionTypes, open } from ".";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";

export const openSuccessSnack = (message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(open('success', message, onUndo));
}

export const openErrorSnack = (message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(open('error', message, onUndo));
}

export const openWarningSnack = (message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(open('warning', message, onUndo));
}

export const openInfoSnack = (message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(open('info', message, onUndo));
}

export const testSnack: ActionCreator<ThunkAction<void, ApplicationState, null, SnackActionTypes>> =
    (message: string | undefined, onUndo?: () => void) => (dispatch) => {
        dispatch(open('info', message, onUndo));
        // return dispatch({
        //     type: SET_TEXT,
        //     text
        // });
    };