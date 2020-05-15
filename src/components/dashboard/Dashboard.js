import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../consts/index';
import StocksTable from '../StocksTable';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['fetchOpenInterest', 'changeExchange', 'excecuteInInterval']);
        this.count = 0;
        this.timer = null;
        this.state = {
            exchange: 'nse'
        };
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
        if(this.count % 2 === 0) {
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

        const {initData = {}, allStocksScripts={}, localStoreData={}} = this.props;

        const {addedToBuyers = {}, removedFromBuyers = {}, filterSuddenValueGainer={},
            removedFromSellers = {}, recoverFilterData = [], filterFallFromHighData = [], allVolatileStocks=[],
            addedToSellers = {}, filterOpenInterest = {}, onlyBuyersWithHighDemand = [], onlySellersWithHighDemand = []} = localStoreData;

        return (
            <div className="stock-data">
                <div>
                    <span>Exchange Type: <AntSwitch checkedChildren="NSE" unCheckedChildren="BSE" defaultChecked checked={this.state.exchange === 'nse' ? true : false} onChange={this.changeExchange} /></span>
                    <span className="open-interest-btn"><Button onClick={this.fetchOpenInterest}>Fetch Open Interest</Button></span>
                </div>
                <div>
                    {this.renderSectionOnObject('Added To Only Buyers', addedToBuyers, 'Buy soon')}
                    {this.renderSectionOnObject('Removed from  Only Buyers', removedFromBuyers, 'Watch for sell')}
                    {this.renderSectionOnObject('Added To Only Sellers', addedToSellers, 'Sell soon')}
                    {this.renderSectionOnObject('Removed from Only Sellers', removedFromSellers, 'Watch for buy')}
                </div>
                {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand')}

                {this.renderSectionOnArray('High open interest with only buyers', onlyBuyersWithHighDemand, '', 'bestBuyQty') }

                {this.renderSectionOnArray('High open interest with only Sellers', onlySellersWithHighDemand, '', 'bestSellQty') }

                {this.renderSectionOnArray('Recover from intra day low', recoverFilterData, 'Short Trade Sell', 'aboveDaysLowPerChange') }

                {this.renderSectionOnArray('Fall From intra day high', filterFallFromHighData, 'Short Trade Buy', 'belowDaysHighPerChange') }
                
                {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, '', 'percentChange')}    

                {/* Sudden change in volume percentage(300) & price -- Most active by volume API  --- Call this api every 5 mins */}
                {/* {this.renderSectionOnObject('Open Interest Change', filterOpenInterest, 'Sudden Rise in Open Interest')} */}

                <div className="money-control-OI">
                    {filterOpenInterest && Object.keys(filterOpenInterest).map((item) => {
                        return (<div className="OI_items" key={item}>
                            <div>{item}</div>
                            <div>{filterOpenInterest[item]['Increase(%)']}</div>
                            <div>Current Price: {filterOpenInterest[item]['AveragePrice']}</div>
                            <div>Increase in OI Percent: {filterOpenInterest[item]['Increase(%)']}</div>
                        
                            <div>Value(Rs. Lakh): {filterOpenInterest[item]['Value(Rs. Lakh)']}</div>
                        </div>);
                    })}
                </div>
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
