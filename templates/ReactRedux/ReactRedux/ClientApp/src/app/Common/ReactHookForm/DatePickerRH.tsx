import React, { useRef } from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { Grid, TextField } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';
import { getPropertyByPath } from '../../../utils/formatHelper';

export interface DatePickerRHProps extends Omit<DatePickerProps, 'value' | 'onChange' | 'renderInput'>, FormItemRHProps {
    defaultValue?: Date;
};

export const DatePickerRH: React.FC<DatePickerRHProps> = ({ name, rules, gridXs, defaultValue, ...props }) => {
    const { errors, control } = useFormContext();
    const error = getPropertyByPath(errors, name);
    const datePickerInputRef = useRef<HTMLInputElement | null>(null);
    const element =
        <Controller
            control={control}
            name={name as any}
            rules={rules}
            onFocus={() => datePickerInputRef.current?.focus()}
            defaultValue={defaultValue}
            render={({ onChange, onBlur, value }) => (
                <DatePicker
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            onBlur={onBlur}
                            inputRef={ref => {
                                props.inputRef && (props.inputRef as (instance: any) => void)(ref);
                                datePickerInputRef.current = ref;
                            }}
                            error={error !== undefined}
                            helperText={error && error.message}
                        />
                    )}

                    {...props}
                />
            )}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}