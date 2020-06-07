import React from 'react';
import { useHistory } from 'react-router-dom';
import { CallbackComponent } from 'redux-oidc';
import { userManager } from '../../../utils/userManager';

export const Callback = () => {
    const history = useHistory();
    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={user => {
                history.push(user.state || '/');
            }}
            errorCallback={error => {
                // TODO: show snackbar error message (like auth failed or something)
                history.push("/");
                console.error(error);
            }}>
            <div>Переадресация...</div>
        </CallbackComponent>
    );
}