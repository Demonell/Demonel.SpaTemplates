import React, { useEffect, useRef } from 'react';
import { LinearProgress, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { makeProgressTick, SkipTicks, clearProgressBar } from './duck';
import { ApplicationState } from '../../../store';
import clsx from 'clsx';

export const ProgressBar: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const classes = useStyles();

    const state = useSelector((state: ApplicationState) => state.progressBar!, shallowEqual);
    const { inProgress, progress, skippedTicks, id } = state;
    const idRef = useRef<string>();
    idRef.current = id;

    useEffect(() => {
        dispatch(clearProgressBar());
    }, [dispatch, location.pathname]);

    useEffect(() => {
        const timer = setInterval(() => {
            dispatch(makeProgressTick());
        }, 400);

        return () => {
            clearInterval(timer);
        };
    }, [dispatch]);

    return (
        inProgress && skippedTicks >= SkipTicks
            ? <LinearProgress variant="determinate" value={progress} className={clsx('position-absolute w-100', classes.progress)} />
            : <></>
    )
}

const useStyles = makeStyles({
    progress: {
        zIndex: 4,
        height: 3
    }
});