export interface UniversalTableState {
    tableSettings: TableSettings[];
};

export interface TableSettings {
    tableUrl: string;
    hiddenColumns: string[];
    columnOrder: string[];
}

export const tableSettingsLocalStorageName = 'tableSettings';

export const SET_STATE = 'TABLE_UNIVERSAL/SET_STATE';
export const ADD_TABLE_SETTINGS = 'TABLE_UNIVERSAL/ADD_TABLE_SETTINGS';
export const SET_TABLE_SETTINGS = 'TABLE_UNIVERSAL/SET_TABLE_SETTINGS';
export const ADD_HIDDEN_COLUMNS = 'TABLE_UNIVERSAL/ADD_HIDDEN_COLUMNS';
export const REMOVE_HIDDEN_COLUMNS = 'TABLE_UNIVERSAL/REMOVE_HIDDEN_COLUMNS';
export const ADD_COLUMN_ORDER = 'TABLE_UNIVERSAL/ADD_COLUMN_ORDER';
export const REMOVE_COLUMN_ORDER = 'TABLE_UNIVERSAL/REMOVE_COLUMN_ORDER';

export interface SetStateAction {
    type: typeof SET_STATE;
    state: Partial<UniversalTableState>;
}

export interface AddTableSettingsAction {
    type: typeof ADD_TABLE_SETTINGS;
    tableSettings: TableSettings;
}

export interface SetTableSettingsAction {
    type: typeof SET_TABLE_SETTINGS;
    tableUrl: string;
    tableSettings: Partial<TableSettings>;
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

export type TableUniversalActionTypes =
    SetStateAction
    | AddTableSettingsAction
    | SetTableSettingsAction
    | AddHiddenColumnsAction
    | RemoveHiddenColumnsAction
    | AddColumnOrderAction
    | RemoveColumnOrderAction;