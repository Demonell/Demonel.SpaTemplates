import React from 'react';
import { Snackbar, Slide, Button } from '@material-ui/core';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ApplicationState } from '../../../store';
import { closeSnack } from './duck';
import { Alert } from '@material-ui/lab';

export const Snack = () => {
    const dispatch = useDispatch();

    const { snackType, opened, message, onUndo } = useSelector((state: ApplicationState) => state.snack!, shallowEqual);

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={opened}
            TransitionComponent={props => <Slide {...props} direction='right' />}
            onClick={() => dispatch(closeSnack())}
            action={onUndo && <Button color="secondary" size="small" onClick={onUndo}>Отменить</Button>}
        >
            <Alert severity={snackType} className='cursor-pointer'>
                {message}
            </Alert>
        </Snackbar>
    );
}