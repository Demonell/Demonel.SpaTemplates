import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";
import { formatDate } from '../../../../utils/formatHelper';

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