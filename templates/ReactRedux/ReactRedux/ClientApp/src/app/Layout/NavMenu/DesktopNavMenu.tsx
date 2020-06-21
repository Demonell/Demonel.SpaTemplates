import React from 'react';
import { NavMenuItem } from './NavMenuItem';
import { makeStyles, Tab } from '@material-ui/core';
import { NavMenuLink } from '.';

export interface DesktopNavMenuProps {
    items: NavMenuItem[];
}

export const DesktopNavMenu: React.FC<DesktopNavMenuProps> = ({ items }) => {
    const classes = useStyles();

    return (
        <>
            {items.map(item =>
                <NavMenuLink
                    key={item.name}
                    to={item.to}
                >
                    <Tab className={classes.navTab} label={item.name} icon={<item.Icon />} />
                </NavMenuLink>
            )}
        </>
    );
}

const useStyles = makeStyles({
    navTab: {
        minWidth: 100,
        minHeight: 0
    }
});