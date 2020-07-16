import React from 'react';
import { AppBar, Toolbar, useMediaQuery } from '@material-ui/core';
import { NavMenuItem, NavProfileMenu, DesktopNavMenu, MobileNavMenu } from '.';
import { FlexGrow } from '../../Common';
import logo from './logo.png';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import { Link } from 'react-router-dom';
import { ProductsLink } from '../../Products';
import { LocalGroceryStore as LocalGroceryStoreIcon, AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { ProductsAddFormikLink } from '../../Products/Add/Formik';
import { ProductsAddReactHookFormLink } from '../../Products/Add/ReactHookForm';

const menuItems: NavMenuItem[] = [
    { name: 'Продукты', to: ProductsLink, Icon: LocalGroceryStoreIcon },
    { name: 'Добавить продукт (Formik)', to: ProductsAddFormikLink, Icon: AddShoppingCartIcon },
    { name: 'Добавить продукт (Hook Form)', to: ProductsAddReactHookFormLink, Icon: AddShoppingCartIcon },
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

