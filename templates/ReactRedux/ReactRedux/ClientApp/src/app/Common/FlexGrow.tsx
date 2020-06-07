import React from 'react';
import { makeStyles } from '@material-ui/core';

export const FlexGrow = React.memo(() => {
    const classes = useStyles();
    return (
        <div className={classes.grow}></div>
    );
})

const useStyles = makeStyles({
    grow: {
        flexGrow: 1,
    }
});