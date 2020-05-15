import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import moment from 'moment-timezone';
import {ConfigProvider} from 'antd';
import {IntlProvider} from 'react-intl';
import {Router} from 'react-router-dom';
import store, {persistor} from './store/configureStore';
// import {browserHistory, createBrowserHistory} from './history';
import {PersistGate} from 'redux-persist/integration/react';
import {Spin} from 'antd';
import en_GB from 'antd/es/locale-provider/en_GB';
import App from './app';
import stockStyle from '../styles/stocks.less';

moment.tz.setDefault('Europe/London');
const appStore = store;

const Main = ({store}) => (
    <Provider store={store} className={stockStyle}>
        {/* <ErrorBoundary> */}
        <PersistGate loading={<Spin/>} persistor={persistor}>
            <ConfigProvider locale={en_GB}>
                <IntlProvider locale="en">
                    {/* <Router> */}
                    <div>
                        <App />
                    </div>
                    {/* </Router> */}
                </IntlProvider>
            </ConfigProvider>
        </PersistGate>
        {/* </ErrorBoundary> */}
    </Provider>
);

Main.propTypes = {
    store: PropTypes.object.isRequired
};


render(<Main store={appStore} />, document.getElementById('app'));
