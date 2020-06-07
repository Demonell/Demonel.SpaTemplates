import React, { useState } from 'react';
import { userManager } from '../../../utils/userManager';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import { Button, Menu, MenuItem, MenuProps } from '@material-ui/core';
import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';

export const NavProfileMenu = () => {
    const location = useLocation();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const user = useSelector((state: ApplicationState) => state.oidc!.user);

    if (user) {
        return (
            <>
                <Button aria-controls="profile-menu" aria-haspopup="true" onClick={event => setAnchorEl(event.currentTarget)}>
                    {user.profile.name}
                    <AccountCircleIcon className='m-1' />
                </Button>
                <MenuStyled
                    id="profile-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => {
                        userManager.signoutRedirect({ 'id_token_hint': user.id_token, state: location.pathname });
                        userManager.removeUser();
                    }}>Выйти</MenuItem>
                </MenuStyled>
            </>
        );
    } else {
        return (
            <Button onClick={() => userManager.signinRedirect({ state: location.pathname })}>
                Войти
                <AccountCircleIcon className='m-1' />
            </Button>
        );
    }
};

const MenuStyled: React.FC<MenuProps> = (props) => (
    <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
);