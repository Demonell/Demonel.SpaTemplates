import React from 'react';
import { NavMenuItem } from './NavMenuItem';
import { makeStyles, Tab } from '@material-ui/core';
import { NavMenuLink } from '.';

export interface DesktopNavMenuProps {
    items: NavMenuItem[];
    claims: string[];
}

export const DesktopNavMenu: React.FC<DesktopNavMenuProps> = ({ items, claims }) => {
    const classes = useStyles();

    return (
        <>
            {items.map((item, index) => {
                if (item.requireClaim !== undefined && claims.indexOf(item.requireClaim) === -1) {
                    return undefined;
                }

                return (
                    <NavMenuLink
                        key={`desktop-menuitem-${index}`}
                        to={item.to}
                    >
                        <Tab className={classes.navTab} label={item.name} icon={<item.Icon />} />
                    </NavMenuLink>
                );
            })}
        </>
    );
}

const useStyles = makeStyles({
    navTab: {
        minWidth: 100,
        minHeight: 0
    }
});