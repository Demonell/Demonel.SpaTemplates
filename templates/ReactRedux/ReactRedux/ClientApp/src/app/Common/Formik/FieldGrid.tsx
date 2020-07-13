import React, { PropsWithChildren } from "react";
import { Grid } from "@material-ui/core";
import { Field } from "formik";

export type gridXsType = boolean | 2 | 1 | "auto" | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;

export interface FieldGridProps<T> {
    fieldName: string;
    gridXs?: gridXsType;
    validate?: (value: any) => string | undefined;
}

export function FieldGrid<T>(props: PropsWithChildren<FieldGridProps<T>>) {
    const { fieldName, gridXs, validate, children } = props;
    const element = (
        <Field name={fieldName} validate={validate}>
            {children}
        </Field>
    );

    return gridXs
        ?
        <Grid item xs={gridXs} >
            {element}
        </Grid>
        : element;
}

export function separateFieldProps<T>(props: PropsWithChildren<FieldGridProps<T>> & any): [PropsWithChildren<FieldGridProps<T>>, any] {
    const { fieldName, gridXs, validate, children, ...rest } = props;
    return [{fieldName, gridXs, validate, children}, rest];
} 