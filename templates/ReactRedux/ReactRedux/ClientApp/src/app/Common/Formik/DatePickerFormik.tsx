import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldProps } from 'formik';
import { DatePickerProps, DatePicker } from '@material-ui/pickers';
import { FieldGridProps } from '.';
import { FieldGrid, separateFieldProps } from './FieldGrid';

export function DatePickerFormik<T>(props: React.PropsWithChildren<FieldGridProps<T> & Partial<DatePickerProps>>) {
    const { onChange, ...rest } = props;
    const [fieldProps, datePickerProps] = separateFieldProps(rest);
    return (
        <FieldGrid {...fieldProps}>
            {({ field, form, meta }: FieldProps<Date | null>) =>
                <DatePicker
                    {...field}
                    {...datePickerProps}

                    renderInput={(props) => (
                        <TextField
                            {...props}
                            error={meta.touched && meta.error !== undefined}
                            helperText={meta.touched && meta.error}
                            onBlur={() => form.setFieldTouched(field.name, true)}
                        />
                    )}
                    onChange={date => {
                        form.setFieldValue(field.name, date as Date);
                        onChange?.(date);
                    }}
                />
            }
        </FieldGrid>
    );
}