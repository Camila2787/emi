import React, { useState, useEffect } from 'react';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import jssExtend from 'jss-extend';
import history from '@history';
import { Auth } from './auth';
import store from './store';
import AppContext from './AppContext';
import routes from './fuse-configs/routesConfig';
import { create } from 'jss';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';
import keycloakService from './services/keycloakService';
import graphqlService from './services/graphqlService';
import { useSelector } from 'react-redux';
import * as serviceWorker from '../serviceWorker';
import * as Actions from './store/actions';
const UPDATE_THRESHOLD = 60000;
const jss = create({
    ...jssPreset(),
    plugins: [...jssPreset().plugins, jssExtend()],
    insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName();
//const keycloakService = new KeycloakService();



const App = () => {
    const KeycloakProvider = keycloakService.provider;
    const GraphqlProvider = graphqlService.provider;
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.register({
        onSuccess: () => {
            store.dispatch(Actions.setServiceWorkerInit());
        },
        onUpdate: reg => {
            if(window.localStorage.getItem("lastUpdate") && (parseInt(window.localStorage.getItem("lastUpdate")) + UPDATE_THRESHOLD) < Date.now()){
                store.dispatch(Actions.setServiceWorkerUpdate(reg));
            }
            window.localStorage.setItem("lastUpdate", Date.now());
        },
    });
     //serviceWorker.unregister();

    return (
        <KeycloakProvider {...keycloakService.providerArgs}>
            <GraphqlProvider client={graphqlService.client}>
                <AppContext.Provider value={{ routes }}>
                    <StylesProvider jss={jss} generateClassName={generateClassName}>
                        <Provider store={store}>
                            <Auth>
                                <Router history={history}>
                                    <FuseAuthorization>
                                        <FuseTheme>
                                            <FuseLayout />
                                        </FuseTheme>
                                    </FuseAuthorization>
                                </Router>
                            </Auth>
                        </Provider>
                    </StylesProvider>
                </AppContext.Provider>
            </GraphqlProvider>
        </KeycloakProvider>
    );
};

export default App;
