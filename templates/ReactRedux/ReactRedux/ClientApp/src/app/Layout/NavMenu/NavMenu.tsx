import React from 'react';
import { AppBar, Toolbar, useMediaQuery } from '@material-ui/core';
import { NavMenuItem, NavProfileMenu, DesktopNavMenu, MobileNavMenu } from '.';
import { FlexGrow } from '../../Common';
import logo from './logo.png';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import { Link } from 'react-router-dom';

export const NavMenu: React.FC = () => {
    const desktopWidth = useMediaQuery('(min-width:600px)');

    const claims = useSelector((state: ApplicationState) => state.auth!.userInfo.claims);

    const items: NavMenuItem[] = [
    ];

    return (
        <header>
            <AppBar className='mb-4' color='inherit' position='static'>
                <Toolbar>
                    <Link to='/'>
                        <img src={logo} alt="Logo" height="40px" />
                    </Link>
                    {desktopWidth
                        ? <DesktopNavMenu items={items} claims={claims} />
                        : <MobileNavMenu items={items} claims={claims} />}
                    <FlexGrow />
                    <NavProfileMenu />
                </Toolbar>
            </AppBar>
        </header>
    );
}

