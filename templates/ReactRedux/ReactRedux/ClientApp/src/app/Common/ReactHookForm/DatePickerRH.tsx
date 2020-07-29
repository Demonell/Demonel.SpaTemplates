import React, { useRef } from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { Grid, TextField } from '@material-ui/core';
import { DeepMap } from 'react-hook-form/dist/types/utils';
import { FieldError, Controller } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';

export interface DatePickerRHProps extends Omit<DatePickerProps, 'value' | 'onChange' | 'renderInput'> {};

export function DatePickerRH<T>({ name, rules, gridXs, errors, register, control, ...props }: DatePickerRHProps & FormItemRHProps<T>) {
    const errorsUntyped = errors as DeepMap<any, FieldError>;
    const datePickerInputRef = useRef<HTMLInputElement | null>(null);
    const element =
        <Controller
            control={control}
            name={name as any}
            rules={rules}
            onFocus={() => datePickerInputRef.current?.focus()}
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
                            error={errorsUntyped[name] !== undefined}
                            helperText={errorsUntyped[name] && errorsUntyped[name].message}
                        />
                    )}

                    {...props}
                />
            )}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}