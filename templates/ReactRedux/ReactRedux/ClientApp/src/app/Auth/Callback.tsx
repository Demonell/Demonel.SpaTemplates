import React from 'react';
import { useHistory } from 'react-router-dom';
import { CallbackComponent } from 'redux-oidc';
import { userManager } from '../../utils/userManager';
import { useDispatch } from 'react-redux';
import { openTimedSnack } from '../Layout/Snack/duck';

export const Callback = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={user => {
                history.push(user.state || '/');
            }}
            errorCallback={error => {
                dispatch(openTimedSnack('error', 'Ошибка авторизации'));
                history.push("/");
                console.error(error);
            }}>
            <div>Переадресация...</div>
        </CallbackComponent>
    );
}