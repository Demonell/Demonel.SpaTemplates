import React, { useState } from 'react';
import { IconButton, Menu, MenuProps, MenuItem } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { NavMenuItem, NavMenuLink } from '.';

export interface MobileNavMenuProps {
    items: NavMenuItem[];
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ items }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const menuId = 'mobile-nav-menu';
    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                <MenuIcon fontSize='large' />
            </IconButton>
            <MenuStyled id={menuId}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
            >
                {items.map(item =>
                    <NavMenuLink
                        key={item.name}
                        to={item.to}
                    >
                        <MenuItem>
                            <item.Icon fontSize="small" className="mr-3" />
                            {item.name}
                        </MenuItem>
                    </NavMenuLink>
                )}
            </MenuStyled>
        </>
    );
}

const MenuStyled: React.FC<MenuProps> = (props) => {
    return (
        <Menu
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            {...props}
        />
    )
};