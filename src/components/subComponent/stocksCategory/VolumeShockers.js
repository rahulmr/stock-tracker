import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';

import StocksTable from '../../StocksTable';

class VolumeShockers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toBuyFiltered: {},
            toSellFiltered: {}
        };
        bindAll(this, ['excecuteInInterval', 'compareWithSaveState', 'saveCurrentState']);
    }

    componentDidMount() {
        this.excecuteInInterval();
        this.timer = setInterval(() => {
            this.excecuteInInterval();
        }, API_INTERVAL);
    }

    saveCurrentState() {
        const {volumeShockers = {}} = this.props;
        const {allStocksScripts = {}} = volumeShockers;
        this.setState({toBuyFiltered: {}, toSellFiltered: {}});
        localStorage.removeItem('currentState');
        localStorage.setItem('currentState', JSON.stringify(allStocksScripts));
    }

    compareWithSaveState() {
        const {volumeShockers = {}} = this.props;
        const {allStocksScripts = {}} = volumeShockers;
        let savedData = window.localStorage.getItem('currentState');
        if(savedData) {
            savedData = JSON.parse(savedData);
        }
        const toBuyFiltered = {};
        const toSellFiltered = {};
        Object.keys(allStocksScripts).forEach((itemKey) => {
            const item = allStocksScripts[itemKey];
            const saveData = savedData[item.ticker];
            if(saveData && item.totalTradedValue > saveData.totalTradedValue*1.05) {
                if(item.percentChange > saveData.percentChange*1.02 && item.bestBuyQty > saveData.bestBuyQty*1.05) {
                    toBuyFiltered[item.ticker] = item;
                }
                if(item.percentChange < saveData.percentChange*1.02 && item.bestSellQty > saveData.bestSellQty*1.05) {
                    toSellFiltered[item.ticker] = item;
                }
            }
        });
        this.setState({toBuyFiltered, toSellFiltered});
    }

    excecuteInInterval() {
        const {commonProps} = this.props;
        const {exchange = 'nse', minprice, maxprice, marketCap} = commonProps;
        this.props.mostActiveByValue({exchange, minprice, maxprice, marketCap});
    }

    renderSectionOnObject(sectionTitle, sectionData, info = '', param) {
        sectionData = Object.keys(sectionData).map((item) => sectionData[item]);
        return (<StocksTable
            param={param}
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
                    <Button onClick={this.saveCurrentState}>Save current State</Button>
                    <Button onClick={this.compareWithSaveState}>Compare strategy</Button>
                    {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand', 'buyToSellRatio')}
                    {this.renderSectionOnObject('Buyers Volatility', this.state.toBuyFiltered, '', 'buyToSellRatio')}
                    {this.renderSectionOnObject('Sellers Volatility', this.state.toSellFiltered, '', 'buyToSellRatio')}
                    {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, '', 'buyToSellRatio')}
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
