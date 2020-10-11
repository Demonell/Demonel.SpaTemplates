import React from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { TextFieldProps, Grid, TextField } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { getPropertyByPath, getPropertyFullPath } from '../../../utils/formatHelper';

export interface TextFieldRHProps extends Omit<TextFieldProps, 'name'>, FormItemRHProps {}

export function TextFieldRH({ name, rules, gridXs, ...props }: TextFieldRHProps) {
    const { errors, register } = useFormContext();
    const path = getPropertyFullPath(name);
    const error = getPropertyByPath(errors, path);
    const element =
        <TextField
            name={path}
            inputRef={register!(rules)}
            error={error !== undefined}
            helperText={error && error.message}

            {...props}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}