import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";

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

const formatTimespan = (value: any): string => {
    if (value) {
        const values = (value as string).split(/[.:]/);

        let description = '';
        description += values[0] && Number(values[0]) > 0 ? Number(values[0]) + ' дней, ' : '';
        description += values[1] && Number(values[1]) > 0 ? Number(values[1]) + ' часов, ' : '';
        description += values[2] && Number(values[2]) > 0 ? Number(values[2]) + ' минут, ' : '';
        description += values[3] && Number(values[3]) > 0 ? Number(values[3]) + ' секунд, ' : '';
        description += values[4] && Number(values[4]) > 0 ? Number(values[4]) + ' милисекунд, ' : '';

        return description.replace(/, $/, '');
    }
    
    return value;
}