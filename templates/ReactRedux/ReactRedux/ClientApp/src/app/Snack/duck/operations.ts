import { AppThunkAction } from "../../../store";
import { SnackActionTypes, openSnack, closeSnack, SnackType } from ".";

export const openTimedSnack = (type: SnackType, message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(openSnack(type, message, onUndo));
    dispatch(startCloseTimer());
}

let closeTimeout = 0;
export const startCloseTimer = (): AppThunkAction<SnackActionTypes> => (dispatch) => {
    window.clearTimeout(closeTimeout);
    closeTimeout = window.setTimeout(() => {
        dispatch(closeSnack());
    }, 5000);
}