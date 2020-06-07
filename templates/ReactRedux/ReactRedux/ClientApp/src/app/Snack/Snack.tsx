import * as React from 'react';
import { Snackbar, Slide, Button } from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, ReportProblemOutlined as ReportProblemOutlinedIcon, ErrorOutline as ErrorOutlineIcon, InfoOutlined as InfoOutlinedIcon } from '@material-ui/icons';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import { close, SnackType } from './duck';

interface SnackAlert {
    className: string;
    icon: JSX.Element;
}

type SnackAlerts = { [key in SnackType]: SnackAlert };
const snackAlerts: SnackAlerts = {
    'success': {
        className: 'alert alert-success',
        icon: <CheckCircleOutlineIcon className="mr-1" fontSize='small' />
    },
    'error': {
        className: 'alert alert-danger',
        icon: <ErrorOutlineIcon className="mr-1" fontSize='small' />
    },
    'warning': {
        className: 'alert alert-warning',
        icon: <ReportProblemOutlinedIcon className="mr-1" fontSize='small' />
    },
    'info': {
        className: 'alert alert-info',
        icon: <InfoOutlinedIcon className="mr-1" fontSize='small' />
    }
};

export const Snack = () => {
    const { snackType, opened, message, onUndo } = useSelector((state: ApplicationState) => state.snack!, shallowEqual);
    const dispatch = useDispatch();

    const snackAlert = snackAlerts[snackType];
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={opened}
            autoHideDuration={5000}
            onClose={() => dispatch(close())}
            TransitionComponent={props => <Slide {...props} direction="up" />}
            onClick={() => dispatch(close())}
            action={onUndo && <Button color="secondary" size="small" onClick={onUndo}>Отменить</Button>}
        >
            <div className={snackAlert.className + ' cursor-pointer'} role='alert'>
                {snackAlert.icon}
                {message}
            </div>
        </Snackbar>
    );
}