import React from 'react';
import { TextFieldProps, TextField } from '@material-ui/core';
import { FieldProps } from 'formik';
import { FieldGridProps } from '.';
import { FieldGrid } from './FieldGrid';

export function TextFieldFormik<T>(props: React.PropsWithChildren<FieldGridProps<T> & TextFieldProps>) {
    const { fieldName, gridXs, ...rest } = props;
    return (
        <FieldGrid fieldName={fieldName} gridXs={gridXs}>
            {({ field, form, meta }: FieldProps<Date | null>) =>
                <>
                    <TextField {...field} {...rest} />
                    {meta.touched && meta.error && meta.error}
                </>
            }
        </FieldGrid>
    );
}