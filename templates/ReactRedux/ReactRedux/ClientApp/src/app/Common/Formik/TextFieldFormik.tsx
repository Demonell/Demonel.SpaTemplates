import React from 'react';
import { Grid, TextFieldProps, TextField } from '@material-ui/core';
import { Field, FieldProps } from 'formik';

export interface TextFieldFormikProps<T> {
    fieldName: keyof T;
    gridXs?: number;
}

export function TextFieldFormik<T>(props: React.PropsWithChildren<TextFieldFormikProps<T> & TextFieldProps>) {
    const { fieldName, gridXs, children, ...rest } = props;
    const element = (
        <Field
            name={fieldName}
            render={({ field, form, meta }: FieldProps<string>) => {
                return (
                    <>
                        <TextField {...field} {...rest} />
                        {meta.touched && meta.error && meta.error}
                    </>
                )
            }}
        />
    );

    return gridXs
        ?
        <Grid item xs={6}>
            {element}
        </Grid>
        : element;
}