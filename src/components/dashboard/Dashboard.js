import React from 'react';
import {Form, Button, Switch as AntSwitch, Select, Table, Checkbox, InputNumber, Radio} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../consts/index';
import StocksTable from '../StocksTable';
import Music from '../AudioPlayer';
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['largecap', 'midcap', 'smallcap'];
import OITable from '../OiTable';
const Option = Select.Option;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['fetchOpenInterest', 'changeExchange', 'resetAll', 'pauseAudio',
            'compareWithSaveState', 'saveCurrentState', 'selectStocks', 'monitorSelectedStock',
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
            duration: '1D',
            playAudio: false,
            toBuyFiltered: {},
            toSellFiltered: {},
            selectedStocks: [],

            comparePercentageChange: 1.03,
            compareTotalTradedValue: 1.05
            // selectedStocks: ['ABAN', 'JHS', 'HDIL', 'JIYAECO', 'SHIRPUR-G', 'TRIGYN', 'RELINFRA', 'RELHOME', 'INDINFO', 'PILITA', 'ICICIBANK', 'JKIL', 'BEL', 'TATASTLBSL', 'BCP', 'AVONMORE', 'SREEL', 'CONFIPET', 'SPAL', 'WELCORP', 'PRAJIND', 'BHEL', 'JBMA', 'ABFRL', 'SBIN', 'JAGRAN', 'KNRCON', 'ACE', 'HTMEDIA', 'HSCL', 'ONGC', 'GRAPHITE', 'DELTACORP*', 'WELENT', 'CANBK', 'BANKINDIA', 'GVKPIL', 'DHFL', 'DOLAT', 'EIHOTEL', 'SAFARIND', 'L&TFH', 'RECLTD', 'PNB', 'DBCORP', 'SHAILY', 'IOC', 'PSPPROJECT', 'WESTLIFE', 'RADIOCITY', 'VIPIND', 'JAMNAAUTO', 'MAHSEAMLES', 'MULTIBASE', 'FAZE3Q', 'RBLBANK', 'PCJEWELLER', 'ZENTEC', 'KITEX', 'SYNCOMF', 'MIRCELECTR', 'TECHNOFAB', 'VIAANINDUS', 'SOUTHBANK', 'MUKANDLTD', 'SHRIRAMEPC', 'MAGMA', 'THOMASCOOK', 'NATHIND', 'SAKSOFT', 'SNL', 'KGL']

            // var nodeList = document.querySelectorAll('.data-table tr td:nth-child(1)')
            // var itemArr = Array.apply(null, nodeList);
            // itemArr = itemArr.map((item1) => item1.innerText)
        };
    }

    pauseAudio() {
        this.setState({playAudio: false});
    }


    saveCurrentState() {
        const {allStocksScripts = {}} = this.props;
        this.setState({toBuyFiltered: {}, toSellFiltered: {}});
        localStorage.removeItem('currentState');
        localStorage.setItem('currentState', JSON.stringify(allStocksScripts));
    }

    compareWithSaveState() {
        const {allStocksScripts = {}} = this.props;
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
            if(saveData && item.totalTradedValue > saveData.totalTradedValue* this.state.compareTotalTradedValue) {
                if(item.percentChange > saveData.percentChange * this.state.comparePercentageChange) {
                    toBuyFiltered[item.ticker] = item;
                }
                if(item.percentChange < saveData.percentChange * this.state.comparePercentageChange) {
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
        const {refreshRate} = this.props;
        const interval = parseInt(refreshRate*1000, 10) / API_INTERVAL;
        this.count++;
        if(this.count % interval === 0) {
            // update data in localstorage every minute
            if(this.count % 2 === 0) {
                localStorage.removeItem('stockdata');
                if(this.props.localStoreData) {
                    localStorage.setItem('stockdata', JSON.stringify(this.props.localStoreData));
                }
            }
            const commonProps = {
                exchange: this.state.exchange,
                marketCap: this.state.checkedList.toString(),
                minprice: this.state.minprice,
                maxprice: this.state.maxprice,
                duration: this.state.duration
            };
            this.props.fetchOnlyBuyers(commonProps);
            this.props.fetchOnlySellers(commonProps);
            this.props.mostActiveByValue(commonProps);
            if(this.count % 10 === 0) {
                this.fetchOpenInterest();
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

    renderSectionOnArray(sectionTitle, sectionData, info = '', param, additionalCols) {
        return (<StocksTable
            sectionTitle={sectionTitle}
            sectionData={sectionData}
            info={info}
            additionalCols={additionalCols}
            param={param} />);
    }


    selectStocks(selectedStocks) {
        this.props.updateSelectedStocks({selectedStocks});
    }

    componentDidUpdate(prevProps) {
        const {localStoreData = {}} = prevProps;
        const {localStoreData: newStoreData = {}} = this.props;
        let speechText = '';
        const {extremeSuddenBuy = {}, extremeSuddenSell = {}, removedFromBuyers = {}} = localStoreData;
        const {extremeSuddenBuy: currentBuyVal = {}, extremeSuddenSell: currentSellVal = {}, removedFromBuyers: newReomvedFromBuyer = {}, selectedStocks = []} = newStoreData;
        if(Object.keys(extremeSuddenBuy).length !== Object.keys(currentBuyVal).length ||
            Object.keys(extremeSuddenSell).length !== Object.keys(currentSellVal).length) {
            this.setState({playAudio: true});
            speechText = 'Sudden Buy Or Sell';
        }

        const {addedToBuyers = {}, addedToSellers = {}, removedFromSellers = {}} = localStoreData;
        const {addedToBuyers: newAddedToBuyers = {}, addedToSellers: newAddedToSellers = {}, removedFromSellers: newRemovedFromSellers = {}} = newStoreData;

        if(Object.keys(newReomvedFromBuyer).filter((item) => selectedStocks.includes(item)).length !== Object.keys(removedFromBuyers).filter((item) => selectedStocks.includes(item)).length) {
            this.setState({playAudio: true});
            speechText = 'removed from buyer';
        }
        if(Object.keys(newAddedToBuyers).filter((item) => selectedStocks.includes(item)).length !== Object.keys(addedToBuyers).filter((item) => selectedStocks.includes(item)).length) {
            this.setState({playAudio: true});
            speechText = 'added to buyer';
        }
        if(Object.keys(newAddedToSellers).filter((item) => selectedStocks.includes(item)).length !== Object.keys(addedToSellers).filter((item) => selectedStocks.includes(item)).length) {
            this.setState({playAudio: true});
            speechText = 'added to seller';
        }
        if(Object.keys(newRemovedFromSellers).filter((item) => selectedStocks.includes(item)).length !== Object.keys(removedFromSellers).filter((item) => selectedStocks.includes(item)).length) {
            this.setState({playAudio: true});
            speechText = 'removed from seller';
        }

        if(this.state.playAudio) {
            this.playAudio(speechText);
        }
    }

    monitorSelectedStock(e) {
        this.props.trackStocks(e.target.checked);
    }

    playAudio(speechText, repeatCnt = 2) {

        const speechTextNew = `${speechText} in ${this.state.exchange}`;
        console.log(speechText, speechTextNew)
        var cnt = 0;
        var repeat = setInterval(() => {
            var synthesis = window.speechSynthesis;
            this.voice = synthesis.getVoices().filter((voice) => voice.lang === 'en')[0];
            var utterance = new SpeechSynthesisUtterance(speechText);
            // Set utterance properties
            utterance.voice = this.voice;
            utterance.pitch = 1.5;
            utterance.rate = 1.25;
            utterance.volume = 1;
            // Speak the utterance
            synthesis.speak(utterance);
            cnt++;
            if(cnt == repeatCnt) {
                clearInterval(repeat);
            }
        }, 1000);
    }


    render() {

        const {initData = {}, allStocksScripts={}, localStoreData={}, updateRefreshRate} = this.props;

        const {addedToBuyers = {}, removedFromBuyers = {}, filterSuddenValueGainer={}, extremeSuddenBuy={},
            extremeSuddenSell={}, myHoldings = {}, fallInYear = {}, selectedStocks = [],
            removedFromSellers = {}, allVolatileStocks=[], totalTradedValue = 0, refreshRate, trackSelectedStocks,
            addedToSellers = {}, filterOpenInterest = {}, onlyBuyersWithHighDemand = [], onlySellersWithHighDemand = []} = localStoreData;

        // let newArr = this.state.selectedStocks.filter((item) => !Object.keys(allStocksScripts).includes(item));

        return (
            <div className="stock-data">
                <div className="setting-config">
                    {/* {newArr.map((item) => <div key={item} value={item}>{item}</div>)} */}

                    <div className="setting-items"><AntSwitch checkedChildren="NSE" unCheckedChildren="BSE" defaultChecked checked={this.state.exchange === 'nse' ? true : false} onChange={this.changeExchange} /></div>
                    <span className="setting-items open-interest-btn"><Button onClick={this.excecuteInInterval}>Fetch Data</Button></span>
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
                    <span>Traded Value - {parseInt(totalTradedValue, 10)} Cr </span>
                    
                    <Select style={{width: 120}} value={refreshRate} onChange={updateRefreshRate}>
                        <Option value="30">30 secs</Option>
                        <Option value="45">45 secs</Option>
                        <Option value="60">1 min</Option>
                        <Option value="120">2 min</Option>
                        <Option value="180">3 min</Option>
                        <Option value="240">4 min</Option>
                        <Option value="300">5 min</Option>
                    </Select>
                    <span>Refresh Rate</span>
                    {/* {this.state.playAudio && <Music addedToBuyers={addedToBuyers} pauseAudio={this.pauseAudio} />} */}
                    <div className="duration">
                        <Radio.Group onChange={(e) => this.setState({duration: e.target.value})} defaultValue="1D" buttonStyle="solid">
                            <Radio.Button value="1D">1D</Radio.Button>
                            <Radio.Button value="1W">1W</Radio.Button>
                            <Radio.Button value="1M">1M</Radio.Button>
                            <Radio.Button value="3M">3M</Radio.Button>
                            <Radio.Button value="6M">6M</Radio.Button>
                            <Radio.Button value="1Y">1Y</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="select-columns">
                        <h3>Select Stocks: </h3>
                        <Checkbox
                            checked={trackSelectedStocks} 
                            onChange={this.monitorSelectedStock}>Watch on selected stocks</Checkbox>
                        <Select
                            mode="multiple"
                            className="stocks-select"
                            placeholder="Select the stocks to track"
                            defaultValue={this.state.selectedStocks}
                            value={!isEmpty(selectedStocks) ? selectedStocks : this.state.selectedStocks}
                            onChange={this.selectStocks}>
                            {allStocksScripts && Object.keys(allStocksScripts).map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    </div>
                </div>

                <div className="tables-containers">
                    <div>
                        {this.renderSectionOnObject('Added To Only Buyers', addedToBuyers, 'Buy soon')}
                        {this.renderSectionOnObject('Removed from  Only Buyers', removedFromBuyers, 'Watch for sell')}
                        {this.renderSectionOnObject('Added To Only Sellers', addedToSellers, 'Sell soon')}
                        {this.renderSectionOnObject('Removed from Only Sellers', removedFromSellers, 'Watch for buy')}
                    </div>

                    {this.renderSectionOnObjectOI('Open Interest Change', filterOpenInterest, 'Sudden Rise in Open Interest')}

                    {/* {this.renderSectionOnArray('Recover from intra day low', allVolatileStocks, 'Short Trade Sell', 'aboveDaysLowPerChange') }

                    {this.renderSectionOnArray('Fall From intra day high', allVolatileStocks, 'Short Trade Buy', 'belowDaysHighPerChange') } */}

                    {this.renderSectionOnObject('Extreme sudden Buy', extremeSuddenBuy, 'Sudden buying')}

                    {this.renderSectionOnObject('Extreme sudden Sell', extremeSuddenSell, 'Sudden selling')}

                    {this.renderSectionOnObject('Sudden value shocker', filterSuddenValueGainer, 'Sudden Rise in Demand')}

                    {this.renderSectionOnArray('All volatile Stocks', allVolatileStocks, 'Traded above 10 lacs with above 2% price change', '', ['aboveDaysLowPerChange', 'belowDaysHighPerChange'])}

                    {this.renderSectionOnObject('My Holdings', myHoldings, 'My Holding status')}

                    {this.renderSectionOnArray('High open interest with only buyers', onlyBuyersWithHighDemand, '', 'bestBuyQty') }

                    {this.renderSectionOnArray('High open interest with only Sellers', onlySellersWithHighDemand, '', 'bestSellQty') }
                    {this.renderSectionOnObject('Extreme Fall In Year', fallInYear, '6 months to year')}

                    <div className="compare-saved-state">
                        <h3>
                            Save current market state data & compare with saved state to know what has changed in term of volatility
                        </h3>
                        <Button onClick={this.saveCurrentState}>Save current State</Button>&nbsp;
                        <Button onClick={this.compareWithSaveState}>Compare strategy</Button>
                        <span className="setting-items">
                            Percent Change: <InputNumber value={this.state.comparePercentageChange} min={0} max={100000} defaultValue={1.03} onChange={(val) => this.setState({comparePercentageChange: val})} />
                        </span>
                        <span className="setting-items">
                            Traded Value Change: <InputNumber value={this.state.compareTotalTradedValue} min={0} max={100000} defaultValue={1.05} onChange={(val) => this.setState({compareTotalTradedValue: val})} />
                        </span>

                        {this.renderSectionOnObject('Buyers Volatility', this.state.toBuyFiltered, '', 'buyToSellRatio')}
                        {this.renderSectionOnObject('Sellers Volatility', this.state.toSellFiltered, '', 'buyToSellRatio')}

                    </div>
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
    mostActiveByValue:PropTypes.func,
    refreshRate: PropTypes.string
};

Dashboard.defaultProps = {
    fetchOpenInterest:() => {},
    fetchOnlyBuyers:() => {},
    initData: {},
    localStoreData: {},
    fetchOnlySellers:() => {},
    mostActiveByValue:() => {},
    refreshRate: "60"
};

export default Dashboard;
