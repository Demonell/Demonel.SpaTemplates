import { AppThunkAction } from "../../../../store";
import { TableUniversalActionTypes, tableSettingsLocalStorageName, TableSettings } from "./types";
import { setTableSettings, addTableSettings, addHiddenColumns, removeHiddenColumns, addColumnOrder, removeColumnOrder } from "./actions";
import { exceptArray } from "../../../../utils/arrayHelper";

export const initTableSettings = (defaultSettings: TableSettings): AppThunkAction<TableUniversalActionTypes> => (dispatch, getState) => {
    const currentTableSettings = getState().universalTable!.tableSettings.filter(s => s.tableUrl === defaultSettings.tableUrl)[0];
    if (!currentTableSettings) {
        setTimeout(() => {
            dispatch(addTableSettings(defaultSettings));
        }, 1000);
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

export const toggleColumnVisibility = (tableUrl: string, column: string): AppThunkAction<TableUniversalActionTypes> => (dispatch, getState) => {
    const currentTableSettings = getState().universalTable!.tableSettings.filter(s => s.tableUrl === tableUrl)[0];
    if (currentTableSettings.hiddenColumns.filter(hiddenColumn => hiddenColumn === column)[0]) {
        dispatch(removeHiddenColumns(tableUrl, [column]));
    } else {
        dispatch(addHiddenColumns(tableUrl, [column]));
    }

    dispatch(updateLocalStorage());
}

export const updateColumnOrder = (tableUrl: string, columnOrder: string[]): AppThunkAction<TableUniversalActionTypes> => (dispatch, getState) => {
    dispatch(setTableSettings(tableUrl, { columnOrder: columnOrder }));
    dispatch(updateLocalStorage());
}

export const updateLocalStorage = (): AppThunkAction<TableUniversalActionTypes> => (dispatch, getState) => {
    const tableSettings = getState().universalTable!.tableSettings;
    localStorage.setItem(tableSettingsLocalStorageName, JSON.stringify(tableSettings));
}