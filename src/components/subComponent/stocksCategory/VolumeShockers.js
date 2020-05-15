import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';

import StocksTable from '../../StocksTable';

class VolumeShockers extends React.Component {
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
        const {commonProps} = this.props;
        const {exchange = 'nse', minprice, maxprice, marketCap} = commonProps;
        this.props.mostActiveByValue({exchange, minprice, maxprice, marketCap});
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

        const {volumeShockers = {}} = this.props;
        const {filterSuddenValueGainer = {}, allVolatileStocks = {}} = volumeShockers;

        return (
            <div className="stock-data">
                <div>
                    {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand')}
                    {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, '', 'percentChange')}      
                    {/* Sudden change in volume percentage(300) & price -- Most active by volume API  --- Call this api every 5 mins */}
                    {/* Change in bestBuyQty - Indicates sudden change in open interest */}
                </div>
            </div>
        );
    }
}

VolumeShockers.propTypes = {
    mostActiveByValue:PropTypes.func,
    volumeShockers: PropTypes.object,
    exchange: PropTypes.string
};

VolumeShockers.defaultProps = {
    mostActiveByValue:() => {},
    volumeShockers: {},
    exchange: 'nse'
};

export default VolumeShockers;
