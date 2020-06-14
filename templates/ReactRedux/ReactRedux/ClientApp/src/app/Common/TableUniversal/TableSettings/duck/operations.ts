import { AppThunkAction } from "../../../../../store";
import { TableSettingsActionTypes, tableSettingsLocalStorageName, TableSetting } from "./types";
import { setTableSettings, addTableSettings, addHiddenColumns, removeHiddenColumns, addColumnOrder, removeColumnOrder } from "./actions";
import { exceptArray } from "../../../../../utils/arrayHelper";

export const initTableSettings = (defaultSettings: TableSetting): AppThunkAction<TableSettingsActionTypes> => (dispatch, getState) => {
    const currentTableSettings = getState().tableSettings!.tableSettings.filter(s => s.tableUrl === defaultSettings.tableUrl)[0];
    if (!currentTableSettings) {
        dispatch(addTableSettings(defaultSettings));
    } else {
        const newColumns = exceptArray(defaultSettings.columnOrder, currentTableSettings.columnOrder);
        if (newColumns.length > 0) {
            dispatch(addColumnOrder(defaultSettings.tableUrl, newColumns));
            dispatch(updateLocalStorage());
        }

        const oldColumns = exceptArray(currentTableSettings.columnOrder, defaultSettings.columnOrder);
        if (oldColumns.length > 0) {
            dispatch(removeColumnOrder(defaultSettings.tableUrl, oldColumns));
            dispatch(removeHiddenColumns(defaultSettings.tableUrl, oldColumns));
            dispatch(updateLocalStorage());
        }
    }
}

export const toggleColumnVisibility = (tableUrl: string, column: string): AppThunkAction<TableSettingsActionTypes> => (dispatch, getState) => {
    const currentTableSettings = getState().tableSettings!.tableSettings.filter(s => s.tableUrl === tableUrl)[0];
    if (currentTableSettings.hiddenColumns.filter(hiddenColumn => hiddenColumn === column)[0]) {
        dispatch(removeHiddenColumns(tableUrl, [column]));
    } else {
        dispatch(addHiddenColumns(tableUrl, [column]));
    }

    dispatch(updateLocalStorage());
}

export const updateColumnOrder = (tableUrl: string, columnOrder: string[]): AppThunkAction<TableSettingsActionTypes> => (dispatch, getState) => {
    dispatch(setTableSettings(tableUrl, { columnOrder: columnOrder }));
    dispatch(updateLocalStorage());
}

export const updateLocalStorage = (): AppThunkAction<TableSettingsActionTypes> => (dispatch, getState) => {
    const tableSettings = getState().tableSettings!.tableSettings;
    localStorage.setItem(tableSettingsLocalStorageName, JSON.stringify(tableSettings));
}