import React, { useRef } from 'react';
import { FormItemRHProps } from './FormItemRHProps';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectProps } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { Descriptor } from '../../../utils/descriptors';
import { getPropertyByPath, getPropertyFullPath } from '../../../utils/formatHelper';

export interface SelectRHProps<TDescriptor> extends Omit<SelectProps, 'name' | 'labelId' | 'value' | 'onChange' | 'onBlur' | 'inputRef'>, FormItemRHProps {
    label?: string;
    descriptors: Descriptor<TDescriptor>[];
};

export function SelectRH<TDescriptor>({ label, descriptors, name, rules, gridXs, defaultValue, ...props }: SelectRHProps<TDescriptor>) {
    const { errors, control } = useFormContext();
    const path = getPropertyFullPath(name);
    const error = getPropertyByPath(errors, path);

    const labelId = `${path}-label`;
    const selectInputRef = useRef<HTMLInputElement | null>(null);
    const element =
        <Controller
            control={control}
            name={path}
            rules={rules}
            onFocus={() => selectInputRef.current?.focus()}
            defaultValue={defaultValue}
            render={({ onChange, onBlur, value }) => (
                <FormControl error={error !== undefined}>
                    <InputLabel id={labelId}>{label}</InputLabel>
                    <Select
                        labelId={labelId}
                        value={value ?? ''}
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
                    <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
            )}
        />;

    return gridXs ? <Grid item xs={gridXs}>{element}</Grid> : element;
}