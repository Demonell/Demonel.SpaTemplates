import React, { useRef } from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectProps } from '@material-ui/core';
import { DeepMap } from 'react-hook-form/dist/types/utils';
import { FieldError, Controller } from 'react-hook-form';
import { Descriptor } from '../../../utils/descriptors';

export interface SelectRHProps<TDescriptor> extends Omit<SelectProps, 'labelId' | 'value' | 'onChange' | 'onBlur' | 'inputRef'> {
    label?: string;
    descriptors: Descriptor<TDescriptor>[];
 };

export function SelectRH<TModel, TDescriptor>({ label, descriptors, name, rules, gridXs, errors, register, control, ...props }: SelectRHProps<TDescriptor> & FormItemRHProps<TModel>) {
    const errorsUntyped = errors as DeepMap<any, FieldError>;
    const labelId = `${name}-label`;
    const selectInputRef = useRef<HTMLInputElement | null>(null);
    const element =
        <Controller
            control={control}
            name={name as any}
            rules={rules}
            onFocus={() => selectInputRef.current?.focus()}
            render={({ onChange, onBlur, value }) => (
                <FormControl error={errorsUntyped[name] !== undefined}>
                    <InputLabel id={labelId}>{label}</InputLabel>
                    <Select
                        labelId={labelId}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputRef={selectInputRef}
                        
                        {...props}
                    >
                        <MenuItem value={''} disabled={true}><em>Не выбрано</em></MenuItem>
                        {descriptors.map(descriptor => (
                            <MenuItem key={String(descriptor.value)} value={String(descriptor.value)}>{descriptor.description}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errorsUntyped[name]?.message}</FormHelperText>
                </FormControl>
            )}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}