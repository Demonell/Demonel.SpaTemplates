import React from 'react';
import { Paper, Typography, PaperProps } from '@material-ui/core';
import clsx from 'clsx';

export interface PaperCardProps extends PaperProps {
    label: React.ReactNode;
}

export const PaperCard: React.FC<PaperCardProps> = ({ label, children, className, ...rest }) => {
    const { onClick } = rest;

    let paperClassName = clsx('m-3 p-2', className || '');
    if (onClick) {
        paperClassName = clsx(paperClassName, 'cursor-pointer')
    }

    return (
        <Paper className={paperClassName} {...rest}>
            <Typography variant='h6' className='font-weight-bold mb-n2 ml-3' gutterBottom>
                {label}
            </Typography>
            {children}
        </Paper>
    );
}