import React from 'react';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';

export interface CustomFilterCellProps extends TableFilterRow.CellProps {
    filterCellExtensions: CustomFilterCellExtension[];
}

export interface CustomFilterCellExtension {
    columnName: string;
    CellComponent: React.FunctionComponent<TableFilterRow.CellProps>;
}

export const CustomFilterCell: React.FunctionComponent<CustomFilterCellProps> = ({ filterCellExtensions: filterExtensions, ...props }) => {
    const { column } = props;
    for (let filterCell of filterExtensions) {
        if (filterCell.columnName === column.name) {
            return <filterCell.CellComponent {...props} />
        }
    }

    return <TableFilterRow.Cell {...props} />;
};