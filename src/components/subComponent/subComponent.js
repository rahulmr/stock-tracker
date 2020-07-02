import React from 'react';
import {Form, Button, Switch as AntSwitch, Table, Checkbox, InputNumber, Select} from 'antd';

import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';

import SharpReversal from './stocksCategory/SharpReversal';
import VolumeShockers from './stocksCategory/VolumeShockers';

import TowardOnlyBuyers from './stocksCategory/TowardOnlyBuyers';

import QueryBuilder from './stocksCategory/QueryBuilder';


import {API_INTERVAL} from '../../consts/index';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['largecap', 'midcap', 'smallcap'];

class SubComponent extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['fetchOpenInterest', 'changeExchange', 'resetAll',
            'onCheckAllChange', 'onMarketCapChange', 'excecuteInInterval']);
        this.count = 0;
        this.timer = null;
        this.state = {
            exchange: 'nse,bse',
            // marketCap: ['largecap','midcap','smallcap'],
            checkedList: plainOptions,
            indeterminate: true,
            checkAll: false,
            minprice: 0,
            maxprice: 10000
        };
        this.mySCROPT = null
    }

    onMarketCapChange(checkedList) {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length
        });
    }

    resetAll() {
        localStorage.removeItem('stockdata');
        localStorage.removeItem('historyData');
        localStorage.removeItem('currentState');
        this.props.resetApp();
    }

    onCheckAllChange(e) {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked
        });
    }

    changeExchange() {
        const toggleExhange = this.state.exchange === 'nse' ? 'bse' : 'nse';
        this.setState({exchange: toggleExhange});
    }

    componentDidMount() {
                
        this.excecuteInInterval();
        this.props.mostActiveByValue({exchange: 'nse', minprice: 0, maxprice: 100000});
        this.timer = setInterval(() => {
            this.excecuteInInterval();
        }, API_INTERVAL);
    }

    excecuteInInterval() {
        this.count++;
        //update data in localstorage every minute
        if(this.count % 1 === 0) {
            const exchange = this.state.exchange;
            localStorage.removeItem('stockdata');
            if(this.props.localDataStorage) {
                localStorage.setItem('stockdata', JSON.stringify(this.props.localDataStorage));
            }
            if(this.count > 10) {
                clearInterval(this.timer);
            }
        }
    }

    fetchOpenInterest() {
        // this.props.fetchOpenInterest();
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var el = document.createElement('div');
                el.innerHTML = this.responseText;
                var nodeList = el.querySelectorAll('.tblList tbody tr');
                var itemArr = Array.apply(null, nodeList);

                let objectKeyArr = Array.apply(null, itemArr.slice(0, 1)[0].children);
                objectKeyArr = objectKeyArr.map((item) => item.innerText.trim());

                var itemData = itemArr.slice(1);

                // let createArrItems = new Map();
                let createArrItems = {};

                itemData.forEach((item) => {
                    let newObj = {};
                    let stockName = '';
                    var eachItem = Array.apply(null, item.querySelectorAll('td'));
                    eachItem.forEach((cellItem, index) => {
                        if(index === 0) {
                            stockName = cellItem.innerText.trim();
                        }
                        newObj[objectKeyArr[index]] = cellItem.innerText.trim();
                    });
                    // createArrItems.set(stockName, newObj);
                    createArrItems[stockName] = newObj;
                });

                that.props.openInterest(createArrItems);
            }
        };
        xhttp.open('GET', 'https://www.moneycontrol.com/stocks/fno/marketstats/futures/openint_inc/homebody.php', true);
        xhttp.send();
    }


    render() {

        const {screenType = '', localDataStorage = {}, filterOpenInterest = {}, totalTradedValue,
        QueryBuilderStocks = {}, sharpReversalStocks = {}, VolumeShockersStocks = {}} = this.props;

        const {allStocksScripts = {}} = VolumeShockersStocks;
        
        const commonProps = {
            exchange: this.state.exchange,
            marketCap: this.state.checkedList.toString(),
            minprice: this.state.minprice,
            maxprice: this.state.maxprice
        };
        return (
            <div className="stock-data">
                <div className="setting-config">
                    <div className="setting-items">Exchange Type: <AntSwitch checkedChildren="NSE" unCheckedChildren="BSE" defaultChecked checked={this.state.exchange === 'nse' ? true : false} onChange={this.changeExchange} /></div>
                    <span className="setting-items"><Button className="ant-btn ant-btn-primary" onClick={this.resetAll}>Reset</Button></span>
                    <div className="setting-items">
                        <div className="site-checkbox-all-wrapper">
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                            Check all
                            </Checkbox>
                        </div>
                        <CheckboxGroup
                            options={plainOptions}
                            value={this.state.checkedList}
                            onChange={this.onMarketCapChange}
                        />
                    </div>
                    <div className="setting-items">
                        Min: <InputNumber value={this.state.minprice} min={0} max={100000} defaultValue={3} onChange={(val) => this.setState({minprice: val})} />
                    </div>
                    <div className="setting-items">
                        Max: <InputNumber value={this.state.maxprice} min={0} max={100000} defaultValue={3} onChange={(val) => this.setState({maxprice: val})} />
                    </div>
                    
                    <span>Total Traded Value - {totalTradedValue} </span>
                    <span className="open-interest-btn"><Button onClick={this.fetchOpenInterest}>Fetch Open Interest</Button></span>
                </div>

                {screenType === 'SharpReversal' && <SharpReversal
                    commonProps={commonProps}
                    fetchOnlyBuyers={this.props.fetchOnlyBuyers}
                    filterOpenInterest={filterOpenInterest}
                    fetchOnlySellers={this.props.fetchOnlySellers}
                    sharpReversal={sharpReversalStocks}/>}

                {screenType === 'VolumeShockers' && <VolumeShockers
                    commonProps={commonProps}
                    mostActiveByValue={this.props.mostActiveByValue}
                    volumeShockers={VolumeShockersStocks}/>}
                
                {screenType === 'TowardOnlyBuyers' && <TowardOnlyBuyers
                    commonProps={commonProps}
                    mostActiveByValue={this.props.mostActiveByValue}
                    volumeShockers={VolumeShockersStocks}/>}

                {screenType === 'QueryBuilder' && <QueryBuilder
                    commonProps={commonProps}
                    mostActiveByValue={this.props.mostActiveByValue}
                    queryBuilderStocks={QueryBuilderStocks}/>}


                {/* {filterOpenInterest && Object.keys(filterOpenInterest).map((key) => {
                    return (<div key={filterOpenInterest[key]['Increase(%)']}>
                        <span>{filterOpenInterest[key]}</span>
                        <span>{filterOpenInterest[key]['Increase(%)']}</span>
                    </div>);
                })} */}
            </div>
        );
    }
}

SubComponent.propTypes = {
    fetchOpenInterest:PropTypes.func,
    fetchOnlyBuyers:PropTypes.func,
    initData: PropTypes.object,
    localDataStorage: PropTypes.object,
    fetchOnlySellers:PropTypes.func,
    mostActiveByValue:PropTypes.func
};

SubComponent.defaultProps = {
    fetchOpenInterest:() => {},
    fetchOnlyBuyers:() => {},
    initData: {},
    localDataStorage: {},
    fetchOnlySellers:() => {},
    mostActiveByValue:() => {}
};

export default SubComponent;
