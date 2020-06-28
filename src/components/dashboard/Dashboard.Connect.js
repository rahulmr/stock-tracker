import {connect} from 'react-redux';
import Dashboard from './Dashboard';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, fetchRecoverFromLow, fetchFallFromHigh, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToSellers, openInterest, filterOpenInterest, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks, totalTradedValue, 
        extremeSuddenBuy, extremeSuddenSell, myHoldings, fallInYear,
        onlySellersWithHighDemand, recoverFilterData, filterFallFromHighData} = sampleReducer;

    const localStoreData = {
        addedToBuyers,
        removedFromBuyers,
        removedFromSellers,
        addedToSellers,
        filterOpenInterest,
        recoverFilterData,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand,
        filterFallFromHighData,
        filterSuddenValueGainer,
        totalTradedValue,
        allVolatileStocks,
        myHoldings,
        fallInYear,
        extremeSuddenBuy,
        extremeSuddenSell
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
        fetchRecoverFromLow: (payload) => {
            dispatch(fetchRecoverFromLow(payload));
        },
        fetchFallFromHigh: (payload) => {
            dispatch(fetchFallFromHigh(payload));  
        },
        mostActiveByValue: (payload) => {
            dispatch(mostActiveByValue(payload));
        },
        resetApp: () => {
            dispatch(resetApp());
        },
        openInterest: (payload) => {
            dispatch(openInterest(payload));
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubComponent));
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
