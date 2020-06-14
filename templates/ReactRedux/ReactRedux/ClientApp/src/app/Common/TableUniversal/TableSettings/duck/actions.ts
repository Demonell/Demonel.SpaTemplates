import * as types from './types';

export const setState = (state: Partial<types.TableSettingsState>): types.TableSettingsActionTypes => {
    return {
        type: types.SET_STATE,
        state
    };
}

export const addTableSettings = (tableSettings: types.TableSetting): types.TableSettingsActionTypes => {
    return {
        type: types.ADD_TABLE_SETTINGS,
        tableSettings
    };
}

export const setTableSettings = (tableUrl: string, tableSettings: Partial<types.TableSetting>): types.TableSettingsActionTypes => {
    return {
        type: types.SET_TABLE_SETTINGS,
        tableUrl,
        tableSettings
    };
}

export const addHiddenColumns = (tableUrl: string, columns: string[]): types.TableSettingsActionTypes => {
    return {
        type: types.ADD_HIDDEN_COLUMNS,
        tableUrl,
        columns
    };
}

export const removeHiddenColumns = (tableUrl: string, columns: string[]): types.TableSettingsActionTypes => {
    return {
        type: types.REMOVE_HIDDEN_COLUMNS,
        tableUrl,
        columns
    };
}

export const addColumnOrder = (tableUrl: string, columns: string[]): types.TableSettingsActionTypes => {
    return {
        type: types.ADD_COLUMN_ORDER,
        tableUrl,
        columns
    };
}

export const removeColumnOrder = (tableUrl: string, columns: string[]): types.TableSettingsActionTypes => {
    return {
        type: types.REMOVE_COLUMN_ORDER,
        tableUrl,
        columns
    };
}
