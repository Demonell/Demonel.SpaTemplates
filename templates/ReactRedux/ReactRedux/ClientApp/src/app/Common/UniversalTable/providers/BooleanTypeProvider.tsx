import React from 'react';
import { Select, Input, MenuItem, TableCell, makeStyles } from '@material-ui/core';
import { DataTypeProvider, DataTypeProviderProps, Filter } from '@devexpress/dx-react-grid';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';

export const BooleanFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => <>{value ? 'Да' : 'Нет'}</>;

export const BooleanEditor: React.FC<DataTypeProvider.ValueEditorProps> = ({ value, onValueChange }) => (
    <Select
        input={<Input />}
        value={value ? 'Да' : 'Нет'}
        onChange={event => onValueChange(event.target.value === 'Да')}
        style={{ width: '100%' }}
    >
        <MenuItem value="Да">
            Да
        </MenuItem>
        <MenuItem value="Нет">
            Нет
        </MenuItem>
    </Select>
);

export const BooleanTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
    <DataTypeProvider
        formatterComponent={BooleanFormatter}
        editorComponent={BooleanEditor}

        {...props}
    />
);

export const BooleanFilterCell: React.FC<TableFilterRow.CellProps> = ({ filter, onFilter }) => {
    const classes = useStyles();
    return (
        <TableCell className={classes.cell}>
            <Select
                input={<Input />}
                value={filter && filter.value === 'true' ? 'true' : (filter && filter.value === 'false' ? 'false' : '')}
                onChange={e => onFilter(e.target.value ? { value: e.target.value as string } as Filter : null)}
                style={{ width: '100%' }}
            >
                <MenuItem value="">
                    Не задано
                </MenuItem>
                <MenuItem value="true">
                    Да
                </MenuItem>
                <MenuItem value="false">
                    Нет
                </MenuItem>
            </Select>
        </TableCell>
    )
};

const useStyles = makeStyles(theme => ({
    cell: {
        width: '100%',
        padding: theme.spacing(1),
        paddingBottom: 0
    }
}));