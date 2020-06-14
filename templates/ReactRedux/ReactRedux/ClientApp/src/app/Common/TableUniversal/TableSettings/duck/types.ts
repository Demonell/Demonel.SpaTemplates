export interface TableSettingsState {
    tableSettings: TableSetting[];
};

export interface TableSetting {
    tableUrl: string;
    hiddenColumns: string[];
    columnOrder: string[];
}

export const tableSettingsLocalStorageName = 'tableSettings';

export const SET_STATE = 'TABLE_SETTINGS/SET_STATE';
export const ADD_TABLE_SETTINGS = 'TABLE_SETTINGS/ADD_TABLE_SETTINGS';
export const SET_TABLE_SETTINGS = 'TABLE_SETTINGS/SET_TABLE_SETTINGS';
export const ADD_HIDDEN_COLUMNS = 'TABLE_SETTINGS/ADD_HIDDEN_COLUMNS';
export const REMOVE_HIDDEN_COLUMNS = 'TABLE_SETTINGS/REMOVE_HIDDEN_COLUMNS';
export const ADD_COLUMN_ORDER = 'TABLE_SETTINGS/ADD_COLUMN_ORDER';
export const REMOVE_COLUMN_ORDER = 'TABLE_SETTINGS/REMOVE_COLUMN_ORDER';

export interface SetStateAction {
    type: typeof SET_STATE;
    state: Partial<TableSettingsState>;
}

export interface AddTableSettingsAction {
    type: typeof ADD_TABLE_SETTINGS;
    tableSettings: TableSetting;
}

export interface SetTableSettingsAction {
    type: typeof SET_TABLE_SETTINGS;
    tableUrl: string;
    tableSettings: Partial<TableSetting>;
}

export interface AddHiddenColumnsAction {
    type: typeof ADD_HIDDEN_COLUMNS;
    tableUrl: string;
    columns: string[];
}

export interface RemoveHiddenColumnsAction {
    type: typeof REMOVE_HIDDEN_COLUMNS;
    tableUrl: string;
    columns: string[];
}

export interface AddColumnOrderAction {
    type: typeof ADD_COLUMN_ORDER;
    tableUrl: string;
    columns: string[];
}

export interface RemoveColumnOrderAction {
    type: typeof REMOVE_COLUMN_ORDER;
    tableUrl: string;
    columns: string[];
}

export type TableSettingsActionTypes =
    SetStateAction
    | AddTableSettingsAction
    | SetTableSettingsAction
    | AddHiddenColumnsAction
    | RemoveHiddenColumnsAction
    | AddColumnOrderAction
    | RemoveColumnOrderAction;