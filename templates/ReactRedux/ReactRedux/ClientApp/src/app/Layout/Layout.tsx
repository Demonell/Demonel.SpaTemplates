import * as React from 'react';
import { Container } from '@material-ui/core';
import NavMenu from './NavMenu/NavMenu';

export default (props: { children?: React.ReactNode }) => (
    <>
        <NavMenu />
        <Container maxWidth='xl' className='flex d-flex flex-column'>
            {props.children}
        </Container>
    </>
);
