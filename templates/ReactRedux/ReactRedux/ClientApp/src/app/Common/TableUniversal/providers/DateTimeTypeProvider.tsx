import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";
import { formatDateTime } from '../../../../utils/formatHelper';

export const DateTimeTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
    <DataTypeProvider
        formatterComponent={DateTimeFormatter}
        {...props}
    />
);

const DateTimeFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
    return (
        <>
            {formatDateTime(value)}
        </>
    );
}