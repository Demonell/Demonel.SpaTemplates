import { createSelector } from 'reselect';
import { ApplicationState } from '../../../../../store';
import { TableSetting } from './types';

export const selectTableSettingOfCurrentPathname =
    createSelector<ApplicationState, TableSetting[], string, TableSetting>(
        state => state.tableSettings!.tableSettings,
        state => state.router!.location.pathname,
        (tableSettings, pathname) => tableSettings.filter(setting => setting.tableUrl === pathname)[0]
    )