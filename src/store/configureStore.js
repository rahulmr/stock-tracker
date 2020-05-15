import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import {createEpicMiddleware} from 'redux-observable';
import rootReducer from '../reducers/rootReducers';
import rootEpic from '../epics/rootEpic';
import apisMap from '../api/index';
import { errorHandlingMiddleware } from './middlewares';

const epicMiddleware = createEpicMiddleware({
    dependencies: {apis: apisMap}
});

const persistConfig = {
    key: 'persistData',
    storage: storageSession,
    whitelist: ['persistData'],
    stateReconciler: autoMergeLevel1
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configuredStore = configureStore();
const store = configuredStore.newStore;
const persistor = configuredStore.persistor;

function configureStore() {
    const newStore = createStore(
        persistedReducer,
        composeEnhancers(
            applyMiddleware(
                epicMiddleware,
                errorHandlingMiddleware
            )
        )
    );
    let persistor = persistStore(newStore);
    epicMiddleware.run(rootEpic);

    return {newStore, persistor};
}

export {persistor};
export default store;