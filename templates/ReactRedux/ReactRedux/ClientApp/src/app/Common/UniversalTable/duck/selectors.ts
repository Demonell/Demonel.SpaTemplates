import { createSelector } from 'reselect';
import { ApplicationState } from '../../../../store';
import { TableSettings } from './types';

export const selectTableSettings = (tableUrl: string) => {
    return createSelector<ApplicationState, TableSettings[], TableSettings>(
        state => state.universalTable!.tableSettings,
        tableSettings => tableSettings.filter(setting => setting.tableUrl === tableUrl)[0]
    )
}