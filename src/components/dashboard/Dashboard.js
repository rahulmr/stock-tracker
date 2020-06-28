import React from 'react';
import {Form, Button, Switch as AntSwitch, Table, Checkbox, InputNumber} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../consts/index';
import StocksTable from '../StocksTable';
import Music from '../AudioPlayer';
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['largecap', 'midcap', 'smallcap'];
import OITable from '../OiTable';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['fetchOpenInterest', 'changeExchange', 'resetAll', 'pauseAudio',
            'compareWithSaveState', 'saveCurrentState',
            'onCheckAllChange', 'onMarketCapChange', 'excecuteInInterval']);
        this.count = 0;
        this.timer = null;
        this.state = {
            exchange: 'nse',
            checkedList: plainOptions,
            indeterminate: true,
            checkAll: false,
            minprice: 0,
            maxprice: 10000,
            playAudio: false,
            toBuyFiltered: {},
            toSellFiltered: {}
        };
    }

    pauseAudio() {
        this.setState({playAudio: false});
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

            /* Customize your strategy ********/
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

            if(this.props.localStoreData) {
                localStorage.setItem('stockdata', JSON.stringify(this.props.localStoreData));
            }
            if(this.count > 10) {
                clearInterval(this.timer);
            }
        }
        const {exchange} = this.state;
        this.props.fetchOnlyBuyers({exchange});
        this.props.fetchOnlySellers({exchange});
        this.props.fetchRecoverFromLow({exchange});
        this.props.fetchFallFromHigh({exchange});
        if(this.count % 1 === 0) {
            this.props.mostActiveByValue({exchange});
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

    renderSectionOnObjectOI(sectionTitle, sectionData, info = '') {
        sectionData = Object.keys(sectionData).map((item) => sectionData[item]);    
        return (<OITable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info} />);
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

    componentDidUpdate(prevProps) {
        const {localStoreData = {}} = prevProps;
        const {localStoreData: newStoreData = {}} = this.props;
        const {extremeSuddenBuy = {}, extremeSuddenSell = {}} = localStoreData;
        const {extremeSuddenBuy: currentBuyVal = {}, extremeSuddenSell: currentSellVal = {}} = newStoreData;
        if(Object.keys(extremeSuddenBuy).length !== Object.keys(currentBuyVal).length ||
            Object.keys(extremeSuddenSell).length !== Object.keys(currentSellVal).length) {
                this.setState({playAudio: true});
        }
    }

    render() {

        const {initData = {}, allStocksScripts={}, localStoreData={}} = this.props;

        const {addedToBuyers = {}, removedFromBuyers = {}, filterSuddenValueGainer={}, extremeSuddenBuy={}, 
            extremeSuddenSell={}, myHoldings = {}, fallInYear = {},
            removedFromSellers = {}, recoverFilterData = [], filterFallFromHighData = [], allVolatileStocks=[], totalTradedValue = 0,
            addedToSellers = {}, filterOpenInterest = {}, onlyBuyersWithHighDemand = [], onlySellersWithHighDemand = []} = localStoreData;

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
                    <span>Total Traded Value - {totalTradedValue}</span>
                    <span className="open-interest-btn"><Button onClick={this.fetchOpenInterest}>Fetch Open Interest</Button></span>
                </div>
                <div>
                    {this.renderSectionOnObject('Added To Only Buyers', addedToBuyers, 'Buy soon')}
                    {this.renderSectionOnObject('Removed from  Only Buyers', removedFromBuyers, 'Watch for sell')}
                    {this.renderSectionOnObject('Added To Only Sellers', addedToSellers, 'Sell soon')}
                    {this.renderSectionOnObject('Removed from Only Sellers', removedFromSellers, 'Watch for buy')}
                </div>

                {this.renderSectionOnObjectOI('Open Interest Change', filterOpenInterest, 'Sudden Rise in Open Interest')} 
              
                {this.renderSectionOnArray('Recover from intra day low', recoverFilterData, 'Short Trade Sell', 'aboveDaysLowPerChange') }

                {this.renderSectionOnArray('Fall From intra day high', filterFallFromHighData, 'Short Trade Buy', 'belowDaysHighPerChange') }
                
                {this.renderSectionOnObject('Extreme sudden Buy', extremeSuddenBuy, 'Sudden buying')}

                {this.renderSectionOnObject('Extreme sudden Sell', extremeSuddenSell, 'Sudden selling')}

                {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand')}

                {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, 'Traded above 10 lacs with above 2% price change')}

                {this.renderSectionOnObject('My Holdings', myHoldings, 'My Holding status')}

                {this.renderSectionOnObject('Extreme Fall In Year', fallInYear, '6 months to year')}

                
                {this.renderSectionOnArray('High open interest with only buyers', onlyBuyersWithHighDemand, '', 'bestBuyQty') }

                {this.renderSectionOnArray('High open interest with only Sellers', onlySellersWithHighDemand, '', 'bestSellQty') }


                <Button onClick={this.saveCurrentState}>Save current State</Button>
                <Button onClick={this.compareWithSaveState}>Compare strategy</Button>

                {this.renderSectionOnObject('Buyers Volatility', this.state.toBuyFiltered, '', 'buyToSellRatio')}
                {this.renderSectionOnObject('Sellers Volatility', this.state.toSellFiltered, '', 'buyToSellRatio')}
                    
                {/* Sudden change in volume percentage(300) & price -- Most active by volume API  --- Call this api every 5 mins */}
                {/* {this.renderSectionOnObject('Open Interest Change', filterOpenInterest, 'Sudden Rise in Open Interest')} */}

                {/* <div className="money-control-OI">
                    {filterOpenInterest && Object.keys(filterOpenInterest).map((item) => {
                        return (<div className="OI_items" key={item}>
                            <div>{item}</div>
                            <div>{filterOpenInterest[item]['Increase(%)']}</div>
                            <div>Current Price: {filterOpenInterest[item]['AveragePrice']}</div>
                            <div>Increase in OI Percent: {filterOpenInterest[item]['Increase(%)']}</div>

                            <div>Value(Rs. Lakh): {filterOpenInterest[item]['Value(Rs. Lakh)']}</div>
                        </div>);
                    })}
                </div> */}
            
                {this.state.playAudio && <Music addedToBuyers={addedToBuyers} pauseAudio={this.pauseAudio} />}
            </div>
        );
    }
}

Dashboard.propTypes = {
    fetchOpenInterest:PropTypes.func,
    fetchOnlyBuyers:PropTypes.func,
    initData: PropTypes.object,
    localStoreData: PropTypes.object,
    fetchOnlySellers:PropTypes.func,
    fetchRecoverFromLow:PropTypes.func,
    fetchFallFromHigh:PropTypes.func,
    mostActiveByValue:PropTypes.func
};

Dashboard.defaultProps = {
    fetchOpenInterest:() => {},
    fetchOnlyBuyers:() => {},
    initData: {},
    localStoreData: {},
    fetchOnlySellers:() => {},
    fetchRecoverFromLow:() => {},
    fetchFallFromHigh:() => {},
    mostActiveByValue:() => {}
};

export default Dashboard;
