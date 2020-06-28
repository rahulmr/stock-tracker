import {connect} from 'react-redux';
import SubComponent from './subComponent';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, fetchRecoverFromLow, fetchFallFromHigh, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state, ownProps) => {
    const {screenType = ''} = ownProps;
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToSellers, openInterest, filterOpenInterest, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks, mostActiveByValueAllStocks, totalTradedValue,
        itemKeys, onlySellersWithHighDemand, recoverFilterData, filterFallFromHighData} = sampleReducer;

        
    const sharpReversalStocks = {
        addedToBuyers,
        addedToSellers,
        removedFromSellers,
        removedFromBuyers,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand
    };

    const VolumeShockersStocks = {filterSuddenValueGainer, allVolatileStocks, allStocksScripts};
    const HugePriceChangersStocks = {recoverFilterData, filterFallFromHighData}
   
    const QueryBuilderStocks = {
        mostActiveByValueAllStocks,
        itemKeys
    };

    return {
        initData,
        screenType,
        filterOpenInterest,
        onlyBuyersData: dictDataFormat,
        onlySellersData: dictSellerDataFormat,
        allStocksScripts,
        totalTradedValue,
        openInterest,
        localDataStorage: {
            ...sharpReversalStocks,
            ...VolumeShockersStocks,
            ...HugePriceChangersStocks
        },
        sharpReversalStocks,
        VolumeShockersStocks,
        HugePriceChangersStocks,
        QueryBuilderStocks
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
export default connect(mapStateToProps, mapDispatchToProps)(SubComponent);
