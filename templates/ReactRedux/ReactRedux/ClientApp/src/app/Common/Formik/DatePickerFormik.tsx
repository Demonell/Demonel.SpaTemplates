import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldProps } from 'formik';
import { DatePickerProps, DatePicker } from '@material-ui/pickers';
import { FieldGridProps } from '.';
import { FieldGrid } from './FieldGrid';

export function DatePickerFormik<T>(props: React.PropsWithChildren<FieldGridProps<T> & Partial<DatePickerProps>>) {
    const { fieldName, gridXs, onChange, ...rest } = props;
    return (
        <FieldGrid fieldName={fieldName} gridXs={gridXs}>
            {({ field, form, meta }: FieldProps<Date | null>) =>
                <>
                    <DatePicker
                        {...field}
                        {...rest}

                        renderInput={(props) => (
                            <TextField {...props} helperText="" />
                        )}
                        onChange={date => {
                            form.setFieldValue(field.name, date as Date);
                            onChange?.(date);
                        }}
                    />
                    {meta.touched && meta.error && meta.error}
                </>
            }
        </FieldGrid>
    );
}