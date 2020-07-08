import React from 'react';
import { Typography, makeStyles, Grid } from "@material-ui/core";
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { formatMoney, formatMMYY, formatDate, formatDateTime, formatTimespan } from '../../utils/formatHelper';

export type PropertyVariant = 'mmyydate' | 'date' | 'datetime' | 'timespan' | 'bool' | 'money' | undefined;

export interface PropertyProps {
    label: string;
    value: any;
    className?: string;
    variant?: PropertyVariant;
    gridXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
    link?: string;
    displayIf?: boolean;
    onClick?: () => void;
}

export const Property: React.FC<PropertyProps> =
    ({ label, value, className, variant, gridXs, link, displayIf, onClick, children }) => {
        const classes = useStyles();
        const history = useHistory();

        if (displayIf === false) {
            return <></>;
        }

        value = formatValueByVariant(value, variant);

        const divClassName = clsx('m-2', className);

        const element = (
            <div
                className={onClick || link ? clsx(divClassName, classes.clickableDiv) : divClassName}
                onClick={() => {
                    const selectedText = getSelection()?.toString();
                    if (!selectedText) {
                        onClick?.();
                        link && history.push(link);
                    }
                }}
            >
                <Typography variant="caption" className='text-muted' gutterBottom>
                    {label}
                </Typography>
                <Typography variant="subtitle2" className={classes.value} gutterBottom>
                    {value}
                </Typography>
            </div>
        );

        return (
            <Grid
                item={gridXs !== undefined}
                xs={gridXs}
                container={children ? true : undefined}
                direction={children ? 'row' : undefined}
            >
                {element}
                {children}
            </Grid>
        );
    }

const useStyles = makeStyles({
    value: {
        fontSize: '1.1em'
    },
    clickableDiv: {
        color: '#0000FF',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    }
});

const formatValueByVariant = (value: string, variant: PropertyVariant): string => {
    switch (variant) {
        case 'mmyydate':
            return value ? formatMMYY(value) : 'Нет';
        case 'date':
            return value ? formatDate(value) : 'Нет';
        case 'datetime':
            return value ? formatDateTime(value) : 'Нет';
        case 'timespan':
            return value ? formatTimespan(value) : 'Нет';
        case 'bool':
            return value ? 'Да' : 'Нет'
        case 'money':
            return formatMoney(value);
        default:
            return value;
    }
}