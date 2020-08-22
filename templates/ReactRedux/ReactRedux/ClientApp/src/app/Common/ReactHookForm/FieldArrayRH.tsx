import React, { PropsWithChildren } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ArrayField } from "react-hook-form/dist/types/form";
import { GridProps } from "@material-ui/core";

export interface FieldArrayRHProps<T> extends Omit<GridProps, 'onSubmit'> {
    name: string;
    keyName?: string;
    render: ((data: {
        fields: Partial<ArrayField<T, string>>[];
        append: (value: Partial<T> | Partial<T>[], shouldFocus?: boolean) => void;
        remove: (index?: number | number[] | undefined) => void;
    }) => React.ReactNode);
}

export function FieldArrayRH<T>({ name, keyName, render }: PropsWithChildren<FieldArrayRHProps<T>>) {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray<T, string>(
        {
            control: control,
            name: name,
            keyName: keyName ?? "id"
        }
    );

    return <>{render({ fields, append, remove })}</>;
}