import {connect} from 'react-redux';
import SubComponent from './subComponent';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, fetchRecoverFromLow, fetchFallFromHigh, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state, ownProps) => {
    const {screenType = ''} = ownProps;
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToSellers, openInterest, filterOpenInterest, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks,
        onlySellersWithHighDemand, recoverFilterData, filterFallFromHighData} = sampleReducer;

        
    const sharpReversalStocks = {
        addedToBuyers,
        addedToSellers,
        removedFromSellers,
        removedFromBuyers,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand
    };

    const VolumeShockersStocks = {filterSuddenValueGainer, allVolatileStocks};
    const HugePriceChangersStocks = {recoverFilterData, filterFallFromHighData}
   
    return {
        initData,
        screenType,
        filterOpenInterest,
        onlyBuyersData: dictDataFormat,
        onlySellersData: dictSellerDataFormat,
        allStocksScripts,
        openInterest,
        localDataStorage: {
            ...sharpReversalStocks,
            ...VolumeShockersStocks,
            ...HugePriceChangersStocks
        },
        sharpReversalStocks,
        VolumeShockersStocks,
        HugePriceChangersStocks
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
