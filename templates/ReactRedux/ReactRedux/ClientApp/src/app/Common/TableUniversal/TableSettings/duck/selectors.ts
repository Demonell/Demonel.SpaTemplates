import { createSelector } from 'reselect';
import { ApplicationState } from '../../../../../store';
import { TableSetting } from './types';

export const selectTableSetting = (tableUrl: string) => {
    return createSelector<ApplicationState, TableSetting[], TableSetting>(
        state => state.tableSettings!.tableSettings,
        tableSettings => tableSettings.filter(setting => setting.tableUrl === tableUrl)[0]
    )
}