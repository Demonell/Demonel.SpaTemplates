import './custom.css';

import React from 'react';
import { Route } from 'react-router';
import Layout from './Layout/Layout';
import Home from '../components/Home';
import Counter from '../components/Counter';
import FetchData from '../components/FetchData';
import { AuthRequire } from './Layout/Auth';

export const App = () => {
    return (
        <AuthRequire>
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
            </Layout>
        </AuthRequire>
    );
}
