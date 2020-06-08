import { AppThunkAction } from "../../../../store";
import { SnackActionTypes, openSnack, closeSnack, SnackType } from ".";

let closeTimeout = 0;
export const openTimedSnack = (type: SnackType, message: string | undefined, onUndo?: () => void): AppThunkAction<SnackActionTypes> => (dispatch) => {
    dispatch(openSnack(type, message, onUndo));

    window.clearTimeout(closeTimeout);
    closeTimeout = window.setTimeout(() => {
        dispatch(closeSnack());
    }, 5000);
}