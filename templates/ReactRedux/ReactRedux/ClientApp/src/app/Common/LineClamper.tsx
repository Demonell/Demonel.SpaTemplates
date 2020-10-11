import React from 'react';
import { makeStyles } from "@material-ui/core";

export type LineClamperLineCount = 2 | 3 | 4 | 5 | 6;

export interface LineClamperProps {
    lineCount?: LineClamperLineCount;
}

export function LineClamper({ children, lineCount }: React.PropsWithChildren<LineClamperProps>) {
    const classes = useStyles({ lineCount });

    if (lineCount !== undefined) {
        return <div className={classes.wrapper}>{children}</div>;
    }

    return <>{children}</>;
}

const useStyles = makeStyles<LineClamperProps>({
    wrapper: (props: LineClamperProps) => ({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: props.lineCount,
        WebkitBoxOrient: 'vertical'
    })
});