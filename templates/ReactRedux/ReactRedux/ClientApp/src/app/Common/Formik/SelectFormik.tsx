import React from 'react';
import { SelectProps, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { FieldProps } from 'formik';
import { FieldGridProps } from '.';
import { FieldGrid } from './FieldGrid';
import { Descriptor } from '../../../utils/descriptors';

export interface SelectFormikProps<T extends string | number> {
    required?: boolean;
    descriptors?: Descriptor<T>[];
}

export function SelectFormik<TModel, TValue extends string | number>(props: React.PropsWithChildren<FieldGridProps<TModel> & SelectFormikProps<TValue> & SelectProps>) {
    const { fieldName, gridXs, onChange, required, descriptors, children, ...rest } = props;
    return (
        <FieldGrid fieldName={fieldName} gridXs={gridXs}>
            {({ field, form, meta }: FieldProps<TValue>) =>
                <>
                    <FormControl>
                        <InputLabel id={fieldName.toString()}>{rest.label}</InputLabel>
                        <Select
                            {...field}

                            labelId={fieldName.toString()}

                            {...rest}

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
                    </FormControl>
                    {meta.touched && meta.error && meta.error}
                </>
            }
        </FieldGrid>
    );
}