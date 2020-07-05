import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { App } from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { OidcProvider, loadUser } from 'redux-oidc';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { userManager } from './utils/userManager';
import { LocalizationProvider } from '@material-ui/pickers';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import { AutocompleteProps } from '@material-ui/lab';
import { Table, PagingPanel, TableHeaderRow, TableFilterRow, TableColumnVisibility } from '@devexpress/dx-react-grid-material-ui';
import { purple } from '@material-ui/core/colors';
import DateFnsAdapter from "@material-ui/pickers/adapter/date-fns";
import ruLocale from 'date-fns/locale/ru';
import { ConnectedRouter } from 'connected-react-router'

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
export const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
export const store = configureStore();
loadUser(store, userManager);

declare module '@material-ui/core/styles/props' {
    interface ComponentsPropsList {
        MuiAutocomplete?: AutocompleteProps<any, any, any, any>;
    }
}

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: purple[900]
        },
        secondary: {
            main: purple[900]
        }
    },
    spacing: 4,
    props: {
        MuiAutocomplete: {
            clearText: 'Отчистить',
            closeText: 'Закрыть',
            loadingText: 'Загрузка...',
            noOptionsText: 'Нет подходящих вариантов',
            openText: 'Открыть'
        },
        MuiButton: {
            variant: 'outlined'
        },
        MuiTextField: {
            fullWidth: true
        }
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: '10px'
            }
        },
        MuiTab: {
            wrapper: {
                fontSize: '12px'
            }
        },
        MuiFormControlLabel: {
            root: {
                margin: 0
            }
        }
    }
});

Table.defaultProps = {
    messages: {
        noData: 'Нет данных'
    }
};

PagingPanel.defaultProps = {
    messages: {
        rowsPerPage: 'Строк на странице',
        showAll: 'Все',
        info: (({ from, to, count }) => `${from}-${to} из ${count}`)
    }
};

TableHeaderRow.defaultProps = {
    messages: {
        sortingHint: 'сортировать'
    }
};

TableFilterRow.defaultProps = {
    messages: {
        filterPlaceholder: 'Фильтр...'
    }
};

TableColumnVisibility.defaultProps ={
    messages: {
        noColumns: 'Нечего показывать'
    }
}

ReactDOM.render(
    <Provider store={store}>
        <OidcProvider userManager={userManager} store={store}>
            <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
                <MuiThemeProvider theme={theme}>
                    <ConnectedRouter history={history}>
                        <QueryParamProvider ReactRouterRoute={Route}>
                            <App />
                        </QueryParamProvider>
                    </ConnectedRouter>
                </MuiThemeProvider>
            </LocalizationProvider>
        </OidcProvider>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();
