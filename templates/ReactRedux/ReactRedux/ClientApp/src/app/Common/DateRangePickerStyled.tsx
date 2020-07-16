import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Grid } from '@material-ui/core';
import { DateRangePicker, DateRangeDelimiter, DateRangePickerProps } from '@material-ui/pickers';
import { setTimezoneToUtc } from '../../utils/dateHelper';
import { addDays, addMilliseconds } from 'date-fns';
import { Clear as ClearIcon } from '@material-ui/icons';
import { DateRange } from '@material-ui/pickers/DateRangePicker/RangeTypes';

export interface DateRangePickerStyledProps {
    selectedDateRange?: DateRange<Date>;
    onDateSelected?: (date: DateRange<Date>) => void;
    utc?: boolean;
}

export const DateRangePickerStyled: React.FC<DateRangePickerStyledProps & Partial<DateRangePickerProps>> =
    ({ selectedDateRange, onDateSelected, utc, ...rest }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);

        const handleDateAccept = (date: DateRange<Date>) => {
            date[1] = date[1] ? addMilliseconds(addDays(date[1], 1), -1) : date[1];
            if (utc) {
                const utcDate: DateRange<Date> = [
                    setTimezoneToUtc(date[0]),
                    setTimezoneToUtc(date[1])
                ];
                onDateSelected?.(utcDate);
            } else {
                onDateSelected?.(date);
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
                    const dateTyped = date as DateRange<Date>;
                    if (dateTyped[0]?.getTime() === dateTyped[1]?.getTime()) {
                        setOpen(false);
                        handleDateAccept(dateTyped);
                    }
                    setDateRange(dateTyped);
                }}
                onAccept={(date: unknown) => handleDateAccept(date as DateRange<Date>)}

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
