import * as types from './types';
import { SnackType } from '.';

export const openSnack = (snackType: SnackType, message?: string, onUndo?: () => void): types.OpenAction => {
    return {
        type: types.OPEN,
        snackType,
        message,
        onUndo
    };
}

export const closeSnack = (): types.CloseAction => {
    return {
        type: types.CLOSE
    };
}

