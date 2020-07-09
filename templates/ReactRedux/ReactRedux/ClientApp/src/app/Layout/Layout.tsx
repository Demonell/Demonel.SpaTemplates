import React from 'react';
import { NavMenu } from './NavMenu/NavMenu';
import { Container } from '@material-ui/core';
import { ProgressBar } from './ProgressBar';

export const Layout: React.FC = ({ children }) => {
    return (
        <>
            <ProgressBar />
            <NavMenu />
            <Container maxWidth='xl' className='flex d-flex flex-column'>
                {children}
            </Container>
            {/* <Typography className='m-2 mt-auto' variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href={window.location.href}>
                RFI Bank
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography> */}
        </>
    )
};
