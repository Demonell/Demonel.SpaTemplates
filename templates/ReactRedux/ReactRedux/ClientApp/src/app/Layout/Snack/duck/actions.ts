import * as types from './types';
import { SnackType } from '.';

export const open = (snackType: SnackType, message?: string, onUndo?: () => void): types.OpenAction => {
    return {
        type: types.OPEN,
        snackType,
        message,
        onUndo
    };
}

export const close = (): types.CloseAction => {
    return {
        type: types.CLOSE
    };
}

