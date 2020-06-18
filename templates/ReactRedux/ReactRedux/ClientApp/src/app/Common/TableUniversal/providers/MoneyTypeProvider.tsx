import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";

export const MoneyTypeProvider: React.FC<DataTypeProviderProps> = (props) => (
    <DataTypeProvider
        formatterComponent={MoneyFormatter}
        {...props}
    />
);

const MoneyFormatter: React.FC<DataTypeProvider.ValueFormatterProps> = ({ value }) => {
    return (
        <>
            {formatMoney(value)}
        </>
    );
}

const formatMoney = (value: any): string => {
    return !isNaN(Number(value))
        ? Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',')
        : value;
}