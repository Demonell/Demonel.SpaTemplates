import React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { Button, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

export interface LinkButtonProps {
    to: string;
    displayIf?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps & ButtonProps> = ({ to, displayIf, disabled, ...rest }) => {
    const classes = useStyles();

    if (displayIf === false) {
        return null;
    }

    if (disabled) {
        return (
            <Button color="primary" disabled {...rest}>
                {rest.children}
            </Button>
        );
    }

    return (
        <Link to={to} className={classes.link}>
            <Button color="primary" {...rest}>
                {rest.children}
            </Button>
        </Link>
    );
}

const useStyles = makeStyles({
    link: {
        textDecoration: 'none !important'
    }
});