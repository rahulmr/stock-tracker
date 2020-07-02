import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, trackStocks, updateRefreshRate,
    updateSelectedStocks, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToSellers, openInterest, filterOpenInterest, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks, totalTradedValue, 
        extremeSuddenBuy, extremeSuddenSell, myHoldings, fallInYear, selectedStocks,
        onlySellersWithHighDemand, trackSelectedStocks, refreshRate} = sampleReducer;

    const localStoreData = {
        addedToBuyers,
        removedFromBuyers,
        removedFromSellers,
        addedToSellers,
        filterOpenInterest,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand,
        filterSuddenValueGainer,
        totalTradedValue,
        allVolatileStocks,
        myHoldings,
        fallInYear,
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
