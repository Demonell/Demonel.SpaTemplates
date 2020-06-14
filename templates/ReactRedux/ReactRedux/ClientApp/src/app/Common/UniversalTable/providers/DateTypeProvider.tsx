import React from 'react';
import { DataTypeProvider, DataTypeProviderProps, Filter } from "@devexpress/dx-react-grid";
import { format } from 'date-fns';

export const DateTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

const DateFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
    return (
        <>
            {formatDate(value)}
        </>
    );
}

export const dateFilterPredicate = (value: any, filter: Filter): boolean => {
    const filterValue = filter.value ? filter.value : '';
    return formatDate(value).indexOf(filterValue) !== -1;
}

const formatDate = (value: any): string => {
    return value
        ? format(new Date(value), 'dd.MM.yyyy')
        : '';
}