import * as types from './types';
import { Reducer } from 'redux';
import { exceptArray } from '../../../../../utils/arrayHelper';

const initialState: types.TableSettingsState = {
    tableSettings: JSON.parse(localStorage.getItem(types.tableSettingsLocalStorageName) || '[]') as types.TableSetting[]
};

export const reducer: Reducer<types.TableSettingsState, types.TableSettingsActionTypes> = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case types.SET_STATE:
            return {
                ...state,
                ...action.state
            }
        case types.ADD_TABLE_SETTINGS:
            return {
                ...state,
                tableSettings: [
                    ...state.tableSettings,
                    action.tableSettings
                ]
            }
        case types.SET_TABLE_SETTINGS:
            return {
                ...state,
                tableSettings: state.tableSettings.map(tableSettings =>
                    tableSettings.tableUrl === action.tableUrl
                        ? {
                            ...tableSettings,
                            ...action.tableSettings
                        }
                        : tableSettings)
            }
        case types.ADD_HIDDEN_COLUMNS:
            return {
                ...state,
                tableSettings: state.tableSettings.map(tableSettings =>
                    tableSettings.tableUrl === action.tableUrl
                        ? {
                            ...tableSettings,
                            hiddenColumns: [
                                ...tableSettings.hiddenColumns,
                                ...action.columns
                            ]
                        } as types.TableSetting
                        : tableSettings)
            }
        case types.REMOVE_HIDDEN_COLUMNS:
            return {
                ...state,
                tableSettings: state.tableSettings.map(tableSettings =>
                    tableSettings.tableUrl === action.tableUrl
                        ? {
                            ...tableSettings,
                            hiddenColumns: exceptArray(tableSettings.hiddenColumns, action.columns)
                        } as types.TableSetting
                        : tableSettings)
            }
        case types.ADD_COLUMN_ORDER:
            return {
                ...state,
                tableSettings: state.tableSettings.map(tableSettings =>
                    tableSettings.tableUrl === action.tableUrl
                        ? {
                            ...tableSettings,
                            columnOrder: [
                                ...tableSettings.columnOrder,
                                ...action.columns
                            ]
                        } as types.TableSetting
                        : tableSettings)
            }
        case types.REMOVE_COLUMN_ORDER:
            return {
                ...state,
                tableSettings: state.tableSettings.map(tableSettings =>
                    tableSettings.tableUrl === action.tableUrl
                        ? {
                            ...tableSettings,
                            columnOrder: exceptArray(tableSettings.columnOrder, action.columns)
                        } as types.TableSetting
                        : tableSettings)
            }
        default:
            return state;
    }
}