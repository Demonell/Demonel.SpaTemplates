import React, { RefObject } from 'react';
import { makeStyles } from "@material-ui/core";
import { NavLink, NavLinkProps } from 'react-router-dom';

export const NavMenuLink = React.forwardRef((props: NavLinkProps, ref: ((instance: HTMLAnchorElement | null) => void) | RefObject<HTMLAnchorElement> | null | undefined) => {
    const classes = useStyles();

    return (
        <NavLink
            innerRef={ref}
            className={classes.navLink}
            activeClassName={classes.navLinkActive}
            exact
            {...props}
        />)
}
);

const useStyles = makeStyles(theme => ({
    navLink: {
        color: theme.palette.common.black,
        '&:hover': {
            color: theme.palette.primary.light,
            textDecoration: 'none'
        }
    },
    navLinkActive: {
        color: theme.palette.primary.dark
    }
}));