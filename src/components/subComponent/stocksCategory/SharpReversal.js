import React from 'react';
import {Form, Button, Switch as AntSwitch, Table} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, isEmpty} from 'lodash';
import {API_INTERVAL} from '../../../consts/index';
import StocksTable from '../../StocksTable';
import OITable from '../../OiTable';

class SharpReversal extends React.Component {
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
        const {exchange = 'nse', minprice, maxprice, marketcap} = commonProps;
        this.props.fetchOnlyBuyers({exchange, minprice, maxprice, marketcap});
        this.props.fetchOnlySellers({exchange, minprice, maxprice, marketcap});
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

    render() {

        const {sharpReversal = {}, filterOpenInterest} = this.props;
        const {addedToBuyers = {}, removedFromBuyers = {}, removedFromSellers = {},
            onlyBuyersWithHighDemand=[], onlySellersWithHighDemand = [], addedToSellers = {}} = sharpReversal;

        return (
            <div className="stock-data">
                <div>
                    {this.renderSectionOnObjectOI('Open Interest Change', filterOpenInterest, 'Sudden Rise in Open Interest')}
                    {this.renderSectionOnObject('Added To Only Buyers', addedToBuyers, 'Buy soon')}
                    {this.renderSectionOnObject('Removed from  Only Buyers', removedFromBuyers, 'Watch for sell')}
                    {this.renderSectionOnObject('Added To Only Sellers', addedToSellers, 'Sell soon')}
                    {this.renderSectionOnObject('Removed from Only Sellers', removedFromSellers, 'Watch for buy')}
                    {this.renderSectionOnArray('High open interest with only buyers', onlyBuyersWithHighDemand, '', 'bestBuyQty') }
                    {this.renderSectionOnArray('High open interest with only Sellers', onlySellersWithHighDemand, '', 'bestSellQty') }
                </div>
            </div>
        );
    }
}

SharpReversal.propTypes = {
    fetchOnlyBuyers:PropTypes.func,
    fetchOnlySellers: PropTypes.func,
    sharpReversal: PropTypes.object,
    exchange: PropTypes.string
};

SharpReversal.defaultProps = {
    fetchOnlyBuyers:() => {},
    sharpReversal: {},
    fetchOnlySellers:() => {},
    exchange: 'nse'
};

export default SharpReversal;
