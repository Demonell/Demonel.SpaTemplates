export interface SnackState {
    opened: boolean;
    snackType: SnackType;
    message?: string;
    onUndo?: () => void;
}

export type SnackType = 'success' | 'error' | 'warning' | 'info';

export const OPEN = 'SNACK/OPEN';
export const CLOSE = 'SNACK/CLOSE';

export interface OpenAction {
    type: typeof OPEN;
    snackType: SnackType;
    message?: string;
    onUndo?: () => void;
}

export interface CloseAction {
    type: typeof CLOSE;
}

export type SnackActionTypes =
    OpenAction
    | CloseAction;