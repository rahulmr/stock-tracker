import {connect} from 'react-redux';
import SubComponent from './subComponent';
import {fetchInitData, fetchOnlyBuyers, fetchOnlySellers, openInterest, resetApp, mostActiveByValue} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state, ownProps) => {
    const {screenType = ''} = ownProps;
    const {sampleReducer = {}} = state;
    const {initData, dictDataFormat, dictSellerDataFormat, removedFromBuyers, removedFromSellers, 
        addedToBuyers, addedToSellers, openInterest, filterOpenInterest, onlyBuyersWithHighDemand, 
        filterSuddenValueGainer, allStocksScripts, allVolatileStocks, mostActiveByValueAllStocks, totalTradedValue,
        itemKeys, onlySellersWithHighDemand} = sampleReducer;

        
    const sharpReversalStocks = {
        addedToBuyers,
        addedToSellers,
        removedFromSellers,
        removedFromBuyers,
        onlyBuyersWithHighDemand,
        onlySellersWithHighDemand
    };

    const VolumeShockersStocks = {filterSuddenValueGainer, allVolatileStocks, allStocksScripts};
    
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
            ...VolumeShockersStocks
        },
        sharpReversalStocks,
        VolumeShockersStocks,
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
