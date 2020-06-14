import React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';

export interface LoadingButtonProps {
    isLoading: boolean;
    displayIf?: boolean;
}

export const LoadingButton: React.FC<ButtonProps & LoadingButtonProps> = ({ isLoading, displayIf, disabled, ...rest}) => {
    const classes = useStyles();   

    if (displayIf === false) {
        return <></>;
    }

    return (
            <Button disabled={isLoading || disabled} {...rest}>
                {isLoading && <CircularProgress className={classes.circle} variant="indeterminate" size={18} thickness={4} />}
                {rest.children}
            </Button>
        );
}

const useStyles = makeStyles({
    circle: {
        position: 'absolute',
    }
});