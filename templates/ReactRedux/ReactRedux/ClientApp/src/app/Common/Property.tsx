import React from 'react';
import { Typography, makeStyles, Grid } from "@material-ui/core";
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { formatMoney, formatMMYY, formatDate, formatDateTime, formatTimespan } from '../../utils/formatHelper';

export interface PropertyProps {
    label: string;
    value: any;
    variant?: 'mmyydate' | 'date' | 'datetime' | 'timespan' | 'bool' | 'money';
    gridXs?: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
    link?: string;
    displayIf?: boolean;
    onClick?: () => void;
}

export const Property: React.FC<PropertyProps> = ({ label, value, variant, gridXs, link, displayIf, onClick }) => {
    const classes = useStyles();
    const history = useHistory();

    if (displayIf === false) {
        return null;
    }

    switch (variant) {
        case 'mmyydate':
            value = value ? formatMMYY(value) : 'Нет';
            break;
        case 'date':
            value = value ? formatDate(value) : 'Нет';
            break;
        case 'datetime':
            value = value ? formatDateTime(value) : 'Нет';
            break;
        case 'timespan':
            value = value ? formatTimespan(value) : 'Нет';
            break;
        case 'bool':
            value = value ? 'Да' : 'Нет'
            break;
        case 'money':
            value = formatMoney(value);
            break;
    }

    const divClass = (onClick || link)
        ? clsx('m-2', classes.clickableDiv)
        : 'm-2';

    const element = (
        <div
            className={divClass}
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

    return gridXs !== undefined
        ? <Grid item xs={gridXs}>{element}</Grid>
        : element;
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