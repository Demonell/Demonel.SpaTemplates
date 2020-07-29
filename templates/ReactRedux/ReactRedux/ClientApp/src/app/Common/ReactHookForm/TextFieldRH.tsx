import React from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { TextFieldProps, Grid, TextField } from '@material-ui/core';
import { DeepMap } from 'react-hook-form/dist/types/utils';
import { FieldError } from 'react-hook-form';

export function TextFieldRH<T>({ name, rules, gridXs, errors, register, control, ...props }: TextFieldProps & FormItemRHProps<T>) {
    const errorsUntyped = errors as DeepMap<any, FieldError>;
    const element =
        <TextField
            name={name}
            inputRef={register!(rules)}
            error={errorsUntyped[name] !== undefined}
            helperText={errorsUntyped[name] && errorsUntyped[name].message}

            {...props}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}