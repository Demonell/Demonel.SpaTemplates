import React from 'react';
import { Paper, Typography, PaperProps, makeStyles } from '@material-ui/core';

export interface PaperLayoutProps extends PaperProps {
    label: React.ReactNode;
    size: 600 | 900;
}

export const PaperLayout: React.FC<PaperLayoutProps> = ({ label, size, children, ...rest }) => {
    const classes = useStyles(size);

    return (
        <div className={classes.layout}>
            <Paper className={classes.paper} {...rest}>
                <Typography component="h1" variant="h4" align="center">
                    {label}
                </Typography>
                {children}
            </Paper>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    layout: (size: number) => ({
        width: 'auto',
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        [theme.breakpoints.up(size + theme.spacing(4) * 2)]: {
            width: size,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    }),
    paper: (size: number) => ({
        marginBottom: theme.spacing(3),
        padding: theme.spacing(4),
        [theme.breakpoints.up(size + theme.spacing(6) * 2)]: {
            marginBottom: theme.spacing(6),
            padding: theme.spacing(6),
        },
    })
}));