import React from 'react';
import { SelectProps, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { FieldProps } from 'formik';
import { FieldGridProps } from '.';
import { FieldGrid, separateFieldProps } from './FieldGrid';
import { Descriptor } from '../../../utils/descriptors';

export interface SelectFormikProps<T extends string | number> {
    required?: boolean;
    descriptors?: Descriptor<T>[];
}

export function SelectFormik<TModel, TValue extends string | number>(props: React.PropsWithChildren<FieldGridProps<TModel> & SelectFormikProps<TValue> & SelectProps>) {
    const { onChange, required, descriptors, children, ...rest } = props;
    const [fieldProps, selectProps] = separateFieldProps(rest);
    return (
        <FieldGrid {...fieldProps}>
            {({ field, form, meta }: FieldProps<TValue>) =>
                <>
                    <FormControl error={meta.touched && meta.error !== undefined}>
                        <InputLabel id={field.name}>{rest.label}</InputLabel>
                        <Select
                            {...field}

                            labelId={field.name}

                            {...selectProps}

                            onChange={(event, child) => {
                                field.onChange(event);
                                onChange?.(event, child);
                            }}
                        >
                            {descriptors
                                ? <MenuItem value={''} disabled={required ?? true}><em>Не выбрано</em></MenuItem>
                                : undefined}
                            {descriptors
                                ? descriptors.map(descriptor => (
                                    <MenuItem key={String(descriptor.value)} value={descriptor.value}>{descriptor.description}</MenuItem>
                                ))
                                : undefined}
                            {children}
                        </Select>
                        {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
                    </FormControl>
                </>
            }
        </FieldGrid>
    );
}