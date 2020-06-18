import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { DateRangePicker, DateRangeDelimiter, DateRange, DateRangePickerProps, MaterialUiPickersDate } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { setTimezoneToUtc } from '../../utils/dateHelper';

export interface DateRangePickerStyledProps {
    initDateRange?: DateRange;
    onDateSelected?: (date: DateRange) => void;
    utc?: boolean;
}

export const DateRangePickerStyled: React.FC<DateRangePickerStyledProps & Partial<DateRangePickerProps>> =
    ({ initDateRange, onDateSelected, utc, ...rest }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [dateRange, setDateRange] = useState<DateRange>([null, null]);

        const handleDateAccept = (date: any) => {
            const acceptedDate = date as DateRange;
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
            if (initDateRange) {
                setDateRange(initDateRange);
            }
        }, [initDateRange, setDateRange]);

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
                    <>
                        <TextField {...startProps} variant='standard' helperText='' className='mb-2' />
                        <DateRangeDelimiter> по </DateRangeDelimiter>
                        <TextField {...endProps} variant='standard' helperText='' className='mb-2' />
                    </>
                )}

                {...rest}
            />
        );
    };
