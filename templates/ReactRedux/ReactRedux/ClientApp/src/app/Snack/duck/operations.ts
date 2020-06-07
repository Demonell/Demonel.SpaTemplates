import { AppThunkAction } from "../../../store";
import { SnackActionTypes, open } from ".";

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