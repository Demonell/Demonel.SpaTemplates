import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Grid } from '@material-ui/core';
import { DateRangePicker, DateRangeDelimiter, DateRange, DateRangePickerProps, MaterialUiPickersDate } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { setTimezoneToUtc } from '../../utils/dateHelper';
import { addDays, addMilliseconds } from 'date-fns';
import { Clear as ClearIcon } from '@material-ui/icons';

export interface DateRangePickerStyledProps {
    selectedDateRange?: DateRange;
    onDateSelected?: (date: DateRange) => void;
    utc?: boolean;
}

export const DateRangePickerStyled: React.FC<DateRangePickerStyledProps & Partial<DateRangePickerProps>> =
    ({ selectedDateRange, onDateSelected, utc, ...rest }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [dateRange, setDateRange] = useState<DateRange>([null, null]);

        const handleDateAccept = (date: any) => {
            const acceptedDate = date as DateRange;
            acceptedDate[1] = acceptedDate[1] ? addMilliseconds(addDays(acceptedDate[1], 1), -1) : acceptedDate[1];
            if (utc) {
                const utcDate: DateRange = [
                    setTimezoneToUtc(acceptedDate[0] as ParsableDate) as MaterialUiPickersDate,
                    setTimezoneToUtc(acceptedDate[1] as ParsableDate) as MaterialUiPickersDate
                ];
                onDateSelected?.(utcDate);
            } else {
                onDateSelected?.(acceptedDate);
            }
        }

        useEffect(() => {
            if (selectedDateRange) {
                setDateRange(selectedDateRange);
            }
        }, [selectedDateRange, setDateRange]);

        return (
            <DateRangePicker
                startText="Начальная дата"
                endText="Конечная дата"
                inputFormat="dd/MM/yyyy"
                value={dateRange}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={date => {
                    if (date[0]?.getTime() === date[1]?.getTime()) {
                        setOpen(false);
                        handleDateAccept(date);
                    }
                    setDateRange(date);
                }}
                onAccept={handleDateAccept}

                renderInput={(startProps, endProps) => (
                    <Grid container direction='row' justify='flex-end' alignContent='flex-end' alignItems='flex-end' className='mb-2'>
                        <TextField {...startProps} variant='standard' helperText='' fullWidth={false} />
                        <DateRangeDelimiter> по </DateRangeDelimiter>
                        <TextField {...endProps} variant='standard' helperText='' fullWidth={false} />

                        {rest.clearable &&
                            <IconButton size='small' onClick={() => handleDateAccept([null, null])}>
                                <ClearIcon />
                            </IconButton>}
                    </Grid>
                )}

                {...rest}
            />
        );
    };
