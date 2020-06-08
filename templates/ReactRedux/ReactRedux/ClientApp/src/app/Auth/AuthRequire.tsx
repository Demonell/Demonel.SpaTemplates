import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { userManager } from '../../utils/userManager';
import { Callback } from './Callback';

export const AuthRequire: React.FC = ({ children }) => {
    const location = useLocation();
    const { user, isLoadingUser } = useSelector((state: ApplicationState) => state.oidc!, shallowEqual);

    if (location.pathname === '/callback') {
        return <Callback />;
    }

    if (isLoadingUser) {
        return <span>Загрузка пользователя...</span>;
    }

    if (!user) {
        userManager.signinRedirect({ state: location.pathname });
        return <span>Перенаправление на страницу авторизации...</span>;
    }

    return (
        <>
            {children}
        </>
    );
};
