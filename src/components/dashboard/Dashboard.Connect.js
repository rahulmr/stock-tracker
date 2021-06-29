import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, trackStocks, updateRefreshRate,
    updateSelectedStocks, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToBuyersSelective, addedToSellers, openInterest, filterOpenInterest, suddenChangeInPrice, 
        suddenChangeInOI, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks, largeCap, totalTradedValue, allStocksNames,
        extremeSuddenBuy, extremeSuddenSell, myHoldings, fallInYear, riseInYear, selectedStocks,
        onlySellersWithHighDemand, trackSelectedStocks, refreshRate} = sampleReducer;

    const localStoreData = {
        addedToBuyers,
        addedToBuyersSelective,
        removedFromBuyers,
        removedFromSellers,
        addedToSellers,
        filterOpenInterest,
        suddenChangeInPrice,
        suddenChangeInOI,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand,
        filterSuddenValueGainer,
        totalTradedValue,
        allVolatileStocks,
        largeCap,
        myHoldings,
        fallInYear,
        riseInYear,
        selectedStocks,
        extremeSuddenBuy,
        extremeSuddenSell,
        refreshRate,
        trackSelectedStocks
    };
        
    return {
        initData,
        onlyBuyersData: dictDataFormat,
        onlySellersData: dictSellerDataFormat,
        allStocksScripts,
        allStocksNames,
        openInterest,
        localStoreData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchInitData: (payload) => {
            dispatch(fetchInitData(payload));
        },
        fetchOnlyBuyers: (payload) => {
            dispatch(fetchOnlyBuyers(payload));
        },
        fetchOnlySellers: (payload) => {
            dispatch(fetchOnlySellers(payload));
        },
        mostActiveByValue: (payload) => {
            dispatch(mostActiveByValue(payload));
        },
        resetApp: () => {
            dispatch(resetApp());
        },
        openInterest: (payload) => {
            dispatch(openInterest(payload));
        },
        updateSelectedStocks: (payload) => {
            dispatch(updateSelectedStocks(payload));
        },
        trackStocks: (selectedStocks) => {
            dispatch(trackStocks(selectedStocks));
        },
        updateRefreshRate: (refreshRate) => {
            dispatch(updateRefreshRate(refreshRate));
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubComponent));
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
