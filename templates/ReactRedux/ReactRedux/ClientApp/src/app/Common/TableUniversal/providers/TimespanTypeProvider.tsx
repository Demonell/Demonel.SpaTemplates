import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";
import { formatTimespan } from '../../../../utils/formatHelper';

export const TimespanTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
    <DataTypeProvider
        formatterComponent={TimespanFormatter}
        {...props}
    />
);

const TimespanFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
    return (
        <>
            {formatTimespan(value)}
        </>
    );
}