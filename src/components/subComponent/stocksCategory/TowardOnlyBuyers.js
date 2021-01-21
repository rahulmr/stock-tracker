import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';

import StocksTable from '../../StocksTable';

class TowardOnlyBuyers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyData: {
                0: {},
                5: {},
                10: {},
                15: {},
                20: {},
                25: {},
                30: {}
            },
            currentNumber: 0
        };
        this.count = 0;
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
        const {exchange = 'nse', minprice, maxprice, marketcap} = commonProps;
        this.props.mostActiveByValue({exchange, minprice, maxprice, marketcap});

        this.count++;
        let {currentNumber} = this.state;
        if(this.count % 5 === 0) {
            if(currentNumber == 35) {
                currentNumber = 0;
            }
            this.set5MinsData(currentNumber + 5);
            this.setState({currentNumber: currentNumber + 5});
        }
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


    set5MinsData(cnt) {
        const {volumeShockers = {}} = this.props;
        const {allStocksScripts = {}} = volumeShockers;

        let newData = {};
        Object.keys(allStocksScripts).forEach((data) => {
            const item = allStocksScripts[data];
            newData[data] = {
                companyName: item.companyName,
                currentPrice: item.current,
                percentChange: item.percentChange,
                totalTradedValue: item.totalTradedValue,
                bestBuyQty: item.bestBuyQty,
                bestSellQty: item.bestSellQty,
                aboveDaysLowPerChange: item.aboveDaysLowPerChange,
                belowDaysHighPerChange: item.belowDaysHighPerChange,
                ticker: item.ticker
            };
        });

        let storedHistoryData = window.localStorage.getItem('historyData');
        storedHistoryData = storedHistoryData ? JSON.parse(storedHistoryData) : {};

        const newHistoryData = {
            ...storedHistoryData,
            [cnt]: newData
        };

        localStorage.setItem('historyData', JSON.stringify(newHistoryData));

        this.evaluateData(newHistoryData, cnt, newData);
    }

    evaluateData(newHistoryData, cnt, newData) {
        let historyCompare = {};
        if(cnt === 0) {
            cnt = 35;
        }
        let objKey = cnt - 5;
        for(var i=0; i<6; i++) {
            if(!isEmpty(newHistoryData[objKey])) {
                let filterData = {};
                Object.keys(newData).forEach((item) => {
                    if(newData[item].bestBuyQty > newHistoryData[objKey][item].bestBuyQty * 1.05) {
                        filterData[item] = newData[item];
                    }
                });
                historyCompare[objKey] = filterData;
            } else {
                historyCompare[objKey] = newHistoryData[objKey];
            }
            objKey = cnt - 5;
            if(objKey === 0) {
                objKey = 35;
            }
        }
        this.setState({historyData: {
            ...this.state.historyData,
            ...this.historyCompare
        }});
    }


    render() {

        const {historyData} = this.state;
        return (
            <div className="stock-data">
                <div>
                    {Object.keys(historyData).map((item) => {
                        return this.renderSectionOnObject(`Change In ${item} mins`, this.state.historyData[item], '', 'buyToSellRatio');
                    })}
                </div>
            </div>
        );
    }
}

TowardOnlyBuyers.propTypes = {
    mostActiveByValue:PropTypes.func,
    TowardOnlyBuyers: PropTypes.object,
    exchange: PropTypes.string
};

TowardOnlyBuyers.defaultProps = {
    mostActiveByValue:() => {},
    TowardOnlyBuyers: {},
    exchange: 'nse'
};

export default TowardOnlyBuyers;
