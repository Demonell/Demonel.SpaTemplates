import React from 'react';
import { AppBar, Toolbar, useMediaQuery } from '@material-ui/core';
import { NavMenuItem, NavProfileMenu, DesktopNavMenu, MobileNavMenu } from '.';
import { FlexGrow } from '../../Common';
import logo from './logo.png';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import { Link } from 'react-router-dom';
import { ProductsLink } from '../../Products';
import { LocalGroceryStore as LocalGroceryStoreIcon } from '@material-ui/icons';

const menuItems: NavMenuItem[] = [
    { name: 'Продукты', to: ProductsLink, Icon: LocalGroceryStoreIcon },
];

export const NavMenu: React.FC = () => {
    const desktopWidth = useMediaQuery('(min-width:600px)');

    const claims = useSelector((state: ApplicationState) => state.auth!.userInfo.claims);
    const menus = menuItems.filter(i => i.requireClaim === undefined || claims.indexOf(i.requireClaim) !== -1);

    return (
        <header>
            <AppBar className='mb-4' color='inherit' position='static'>
                <Toolbar>
                    <Link to='/' className='mr-2'>
                        <img src={logo} alt="Logo" height="40px" />
                    </Link>
                    {desktopWidth
                        ? <DesktopNavMenu items={menus} />
                        : <MobileNavMenu items={menus} />}
                    <FlexGrow />
                    <NavProfileMenu />
                </Toolbar>
            </AppBar>
        </header>
    );
}

