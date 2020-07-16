import './custom.css';

import React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import { Layout } from './Layout/Layout';
import { Home, HomeLink } from './Home';
import { Products, ProductsLink } from './Products';
import { AuthRequire } from './Auth';
import { Snack } from './Layout/Snack';
import { ProductsIdLink, ProductsId } from './Products/Id';
import { ProductsAddFormikLink, ProductsAddFormik } from './Products/Add/Formik';
import { ProductsAddReactHookFormLink, ProductsAddReactHookForm } from './Products/Add/ReactHookForm';

export const App = () => {
    return (
        <>
            <AuthRequire>
                <Layout>
                    <Switch>
                        <Route exact path={HomeLink}>
                            <Home />
                        </Route>
                        <Route exact path={ProductsLink}>
                            <Products />
                        </Route>
                        <Route exact path={ProductsAddFormikLink}>
                            <ProductsAddFormik />
                        </Route>
                        <Route exact path={ProductsAddReactHookFormLink}>
                            <ProductsAddReactHookForm />
                        </Route>
                        <Route exact path={ProductsIdLink()}>
                            <ProductsId />
                        </Route>
                        <Route>
                            <Redirect to={HomeLink} />
                        </Route>
                    </Switch>
                </Layout>
            </AuthRequire>
            <Snack />
        </>
    );
}
