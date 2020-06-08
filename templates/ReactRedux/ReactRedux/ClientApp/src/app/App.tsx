import './custom.css';

import React from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './Layout/Layout';
import { Home, HomeLink } from './Home';
import { Products, ProductsLink } from './Products';
import { AuthRequire } from './Auth';
import { Snack } from './Layout/Snack';

export const App = () => {
    return (
        <>
            <AuthRequire>
                <Layout>
                    <Route exact path={HomeLink}>
                        <Home />
                    </Route>
                    <Route exact path={ProductsLink}>
                        <Products />
                    </Route>
                    <Route>
                        <Redirect to={HomeLink} />
                    </Route>
                </Layout>
            </AuthRequire>
            <Snack />
        </>
    );
}
