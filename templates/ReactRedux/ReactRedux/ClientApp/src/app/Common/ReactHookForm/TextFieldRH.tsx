import React from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { TextFieldProps, Grid, TextField } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { getPropertyByPath } from '../../../utils/formatHelper';

export const TextFieldRH: React.FC<TextFieldProps & FormItemRHProps> = ({ name, rules, gridXs, ...props }) => {
    const { errors, register } = useFormContext();
    const error = getPropertyByPath(errors, name);
    const element =
        <TextField
            name={name}
            inputRef={register!(rules)}
            error={error !== undefined}
            helperText={error && error.message}

            {...props}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}