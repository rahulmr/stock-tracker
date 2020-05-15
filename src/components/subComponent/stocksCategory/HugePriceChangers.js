import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';

import StocksTable from '../../StocksTable';

class hugePriceChanges extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['excecuteInInterval']);
    }

    componentDidMount() {
        this.excecuteInInterval();
        this.timer = setInterval(() => {
            this.excecuteInInterval();
        }, API_INTERVAL);
    }

    excecuteInInterval() {
        //update data in localstorage every minute
        const {commonProps} = this.props;
        const {exchange = 'nse', minprice, maxprice, marketCap} = commonProps;
        this.props.fetchRecoverFromLow({exchange, minprice, maxprice, marketCap});
        this.props.fetchFallFromHigh({exchange, minprice, maxprice, marketCap});
    }

    renderSectionOnObject(sectionTitle, sectionData, info = '') {
        sectionData = Object.keys(sectionData).map((item) => sectionData[item]);    
        return (<StocksTable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info} />);
    }

    renderSectionOnArray(sectionTitle, sectionData, info = '', param) {
        return (<StocksTable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info}
            param={param} />);
    }

    render() {

        const {hugePriceChanges = {}} = this.props;
        const {recoverFilterData = {}, filterFallFromHighData = {}} = hugePriceChanges;

        return (
            <div className="stock-data">
                <div>
                    {this.renderSectionOnArray('Recover from intra day low', recoverFilterData, 'Short Trade Sell', 'aboveDaysLowPerChange') }
                    {this.renderSectionOnArray('Fall From intra day high', filterFallFromHighData, 'Short Trade Buy', 'belowDaysHighPerChange') }
                </div>
            </div>
        );
    }
}

hugePriceChanges.propTypes = {
    fetchFallFromHigh:PropTypes.func,
    fetchRecoverFromLow: PropTypes.func,
    hugePriceChanges: PropTypes.object,
    exchange: PropTypes.string
};

hugePriceChanges.defaultProps = {
    fetchFallFromHigh:() => {},
    hugePriceChanges: {},
    fetchRecoverFromLow:() => {},
    exchange: 'nse'
};

export default hugePriceChanges;
