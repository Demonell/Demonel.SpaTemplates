import React from 'react';
import { Paper, Typography, PaperProps } from '@material-ui/core';
import clsx from 'clsx';

export interface PaperCardProps extends PaperProps {
    label: React.ReactNode;
}

export const PaperCard: React.FC<PaperCardProps> = ({ label, children, className, onClick, ...rest }) => {
    if (onClick) {
        className = clsx(className || '', 'cursor-pointer')
    }

    return (
        <Paper
            className={clsx('m-3 p-2', className)}
            onClick={event => {
                const selectedText = getSelection()?.toString();
                if (!selectedText) {
                    onClick?.(event);
                }
            }}

            {...rest}
        >
            <Typography variant='h6' className='font-weight-bold' gutterBottom>
                {label}
            </Typography>
            {children}
        </Paper>
    );
}