import React from 'react';
import { DataTypeProvider, DataTypeProviderProps, Filter } from "@devexpress/dx-react-grid";
import { TableCell, Select, Input, MenuItem, makeStyles } from '@material-ui/core';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';
import { Descriptor, getDescription } from '../../../../utils/descriptors';

export interface DescriptorTypeProviderProps<T> extends React.PropsWithChildren<DataTypeProviderProps> {
    descriptors: Descriptor<T>[];
}

export function DescriptorTypeProvider<T>(props: DescriptorTypeProviderProps<T>) {
    const { descriptors, ...rest } = props;
    return <DataTypeProvider
        formatterComponent={props => <DescriptorFormatter descriptors={descriptors} {...props} />}
        {...rest}
    />
};

interface DescriptorFormatterProps<T> extends DataTypeProvider.ValueFormatterProps {
    descriptors: Descriptor<T>[];
}

function DescriptorFormatter<T>(props: DescriptorFormatterProps<T>) {
    const { descriptors, value } = props;
    const typedValue = value as T;
    return <>{getDescription(typedValue, descriptors)}</>;
}

export interface DescriptorFilterCellProps<T> extends TableFilterRow.CellProps {
    descriptors: Descriptor<T>[];
}

export function DescriptorFilterCell<T>(props: DescriptorFilterCellProps<T>) {
    const { descriptors, filter, onFilter } = props;
    const classes = useStyles();
    return (
        <TableCell className={classes.cell}>
            <Select
                displayEmpty
                input={<Input />}
                value={filter?.value || ''}
                onChange={e => onFilter(e.target.value ? { value: e.target.value as string } as Filter : null)}
                style={{ width: '100%' }}
            >
                <MenuItem value=''>
                    <span className={classes.filterSpan}>Фильтр...</span>
                </MenuItem>
                {descriptors.map((e, index) => (
                    <MenuItem value={String(e.value)} key={'descriptor-select-menu-item-' + index}>
                        {e.description}
                    </MenuItem>
                ))}
            </Select>
        </TableCell>
    )
};

const useStyles = makeStyles(theme => ({
    cell: {
        width: '100%',
        padding: theme.spacing(1),
        paddingBottom: 2
    },
    filterSpan: {
        color: 'rgba(0, 0, 0, 0.33)',
        lineHeight: '1.1876em',
        fontWeight: 500,
        fontSize: '14px'
    }
}));