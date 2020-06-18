import React from 'react';
import { DataTypeProvider, DataTypeProviderProps } from "@devexpress/dx-react-grid";
import { mask } from '../../../../utils/formatHelper';

export interface MaskTypeProviderProps<T> extends React.PropsWithChildren<DataTypeProviderProps> {
    getValue?: (value: T) => string;
    pattern: ((value: T) => string) | string;
}

export function MaskTypeProvider<T>(props: MaskTypeProviderProps<T>) {
    const { getValue, pattern, ...rest } = props;
    return <DataTypeProvider
        formatterComponent={props => <MaskFormatter getValue={getValue} pattern={pattern} {...props} />}
        {...rest}
    />
};

interface MaskFormatterProps<T> extends DataTypeProvider.ValueFormatterProps {
    getValue?: (value: T) => string;
    pattern: ((value: T) => string) | string;
}

function MaskFormatter<T>(props: MaskFormatterProps<T>) {
    const { getValue, pattern, value } = props;
    const typedValue = value as T;
    const stringValue = getValue ? getValue(typedValue) : String(typedValue);
    const stringMask = typeof pattern === 'string' ? pattern : pattern(typedValue);
    return <>{mask(stringValue, stringMask)}</>;
}