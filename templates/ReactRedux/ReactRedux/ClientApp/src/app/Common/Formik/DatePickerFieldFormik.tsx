import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldProps } from 'formik';
import { DatePickerProps, DatePicker } from '@material-ui/pickers';
import { FieldGridProps } from '.';
import { FieldGrid } from './FieldGrid';

export function DatePickerFieldFormik<T>(props: React.PropsWithChildren<FieldGridProps<T> & Partial<DatePickerProps>>) {
    const { fieldName, gridXs, ...rest } = props;
    return (
        <FieldGrid fieldName={fieldName} gridXs={gridXs}>
            {({ field, form, meta }: FieldProps<Date | null>) =>
                <>
                    <DatePicker
                        {...field}

                        onChange={date => form.setFieldValue(fieldName.toString(), date as Date)}
                        renderInput={(props) => (
                            <TextField {...props} helperText="" />
                        )}

                        {...rest}
                    />
                    {meta.touched && meta.error && meta.error}
                </>
            }
        </FieldGrid>
    );
}