import './custom.css';

import React from 'react';
import { Route } from 'react-router';
import Layout from './Layout/Layout';
import Home from '../components/Home';
import Counter from '../components/Counter';
import FetchData from '../components/FetchData';
import { RuntimeConfig } from '../RuntimeConfig';

export const App = () => {
    console.log(RuntimeConfig.AuthorityUrl);
    console.log(RuntimeConfig.MyServiceUrl);
    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
        </Layout>
    );
}
