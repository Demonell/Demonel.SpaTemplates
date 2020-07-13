import React from 'react';
import { TextFieldProps, TextField } from '@material-ui/core';
import { FieldProps } from 'formik';
import { FieldGridProps } from '.';
import { FieldGrid, separateFieldProps } from './FieldGrid';

export function TextFieldFormik<T>(props: React.PropsWithChildren<FieldGridProps<T> & TextFieldProps>) {
    const { onChange, ...rest } = props;
    const [fieldProps, textFieldProps] = separateFieldProps(rest);
    return (
        <FieldGrid {...fieldProps}>
            {({ field, form, meta }: FieldProps<string>) =>
                <TextField
                    {...field}

                    error={meta.touched && meta.error && true}
                    helperText={meta.touched && meta.error}

                    {...textFieldProps}

                    onChange={event => {
                        field.onChange(event);
                        onChange?.(event);
                    }}
                />
            }
        </FieldGrid>
    );
}