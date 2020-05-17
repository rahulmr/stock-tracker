

import { func } from 'prop-types';

import stockInitState from '../initialState/stockState';

import {LOAD_INIT_DATA, API_SUFFIX, FETCH_ONLY_BUYERS, FALL_FROM_HIGH, MOST_ACTIVE_BY_VALUE, 
    FETCH_ONLY_SELLERS, SET_OPEN_INTEREST, RECOVER_FROM_LOW, RESET_APP} from '../actions/actionTypes';

const {SUCCESS} = API_SUFFIX;



const filterOpenInterestUtil = function filterOpenInterestUtil(allOIMap, state) {
    let myMap = {};
    Object.keys(allOIMap).forEach((item) => {
        const value = allOIMap[item];
        if(parseFloat(value['Increase(%)'], 10) > 10 && parseFloat(value['Chg(Rs)Chg (%)'].split(/\s+/g)[1], 10)) {
            myMap[item] = {...allOIMap[item]};
        }
    });
    return myMap;
};

const priceVolumeCriteria = function priceVolumeCriteria(type, item) {
    const {totalTradedValue, aboveDaysLowPerChange, volumeInThousand, bestSellQty,
        bestBuyQty, volume, month6HighPrice, month6LowPrice, current} = item;
    if((totalTradedValue > 0.01 || volumeInThousand > 20) && (bestBuyQty > volume/2 || bestSellQty > volume/2)) {
        if((type === 'gain' && month6HighPrice/1.3 > current) ||
            (type === 'loss' && month6LowPrice < current/1.3)) {
            return true;
        }
        // return true;
    }
    return false;
};


const extractRelevantParams = function extractRelevantParams(item) {
    return {
        companyName: item.companyName,
        updatedDateTime: item.updatedDateTime,
        current: item.current,
        volume: item.volume,
        percentChange: item.percentChange,
        totalTradedValue: item.totalTradedValue
    };
};

const filterBuyersDataFun = function filterBuyersData(buyersData, state) {
    let {searchresult = []} = buyersData;

    // searchresult.splice(Math.random()*buyersData.pagesummary.totalRecords, 1);

    const {dictDataFormat = {}} = state;
    // const dataLen = pagesummary.totalRecords;
    let removedFromBuyers = {};
    let addedToBuyers = {};
    let latestDictDataFormat = {};

    let onlyBuyersWithHighDemand = searchresult.filter((item) => (item.bestBuyQty > item.volume && item.totalTradedValue > 0.005));

    let onlyQualityStocks = searchresult.filter((item) => item.current > 1);

    onlyQualityStocks.forEach((item) => {
        latestDictDataFormat[item.nseScripCode] = item;
        const {nseScripCode} = item;
        if(!dictDataFormat[nseScripCode] && priceVolumeCriteria('gain', item)) {
            addedToBuyers[item.nseScripCode] = extractRelevantParams(item);
        }
    });
    const dictDataFormatKeys = Object.keys(dictDataFormat);
    dictDataFormatKeys.forEach((item) => {
        if(!latestDictDataFormat[item] && priceVolumeCriteria('loss', item)) {
            const getItem = dictDataFormat[item];
            removedFromBuyers[getItem.nseScripCode] = extractRelevantParams(getItem);
        }
    });

    if(dictDataFormatKeys.length === 0) {
        addedToBuyers = {};
    }

    return {
        dictDataFormat: latestDictDataFormat,
        removedFromBuyers: {
            ...state.removedFromBuyers,
            ...removedFromBuyers
        },
        addedToBuyers: {
            ...state.addedToBuyers,
            ...addedToBuyers
        },
        onlyBuyersWithHighDemand
    }
};



const filterSellesDataFun = function filterSellesDataFun(sellersData, state) {
    let {searchresult = []} = sellersData;
    // searchresult.splice(Math.random()*sellersData.pagesummary.totalRecords, 1);
    const {dictSellerDataFormat = {}} = state;
    // const dataLen = pagesummary.totalRecords;
    let removedFromSellers = {};
    let addedToSellers = {};
    let latestDictDataFormat = {};

    let onlySellersWithHighDemand = searchresult.filter((item) => (item.bestSellQty > item.volume && item.totalTradedValue > 0.005));

    let onlyQualityStocks = searchresult.filter((item) => item.current > 1);

    onlyQualityStocks.forEach((item) => {
        latestDictDataFormat[item.nseScripCode] = item;
        if(!dictSellerDataFormat[item.nseScripCode] && priceVolumeCriteria('loss', item)) {
            addedToSellers[item.nseScripCode] = extractRelevantParams(item);
        }
    });
    const dictDataFormatKeys = Object.keys(dictSellerDataFormat);
    dictDataFormatKeys.forEach((item) => {
        if(!latestDictDataFormat[item] && priceVolumeCriteria('gain', item)) {
            const getItem = dictSellerDataFormat[item];
            removedFromSellers[getItem.nseScripCode] = extractRelevantParams(getItem);
        }
    });

    if(dictDataFormatKeys.length === 0) {
        addedToSellers = {};
    }

    return {
        dictSellerDataFormat: latestDictDataFormat,
        removedFromSellers: {
            ...state.removedFromSellers,
            ...removedFromSellers
        },
        addedToSellers: {
            ...state.addedToSellers,
            ...addedToSellers
        },
        onlySellersWithHighDemand
    }
}

const filterFallFromHigh = function filterFallFromHigh(fallFromHigh, state) {
    let {searchresult = []} = fallFromHigh;
    // searchresult.splice(Math.random()*fallFromHigh.pagesummary.totalRecords, 1);
    let filterFallFromHighData = searchresult.filter((item) => {
        const {bestBuyQty, volume, totalTradedValue, belowDaysHighPerChange, current} = item;
        return (totalTradedValue > 0.005 && belowDaysHighPerChange < -5 && current > 0.5);
    });

    return {
        filterFallFromHighData
    };
};

const filterRecoverFromLow = function filterRecoverFromLow(recoverData, state) {
    let {searchresult = []} = recoverData;
    // searchresult.splice(Math.random()*recoverData.pagesummary.totalRecords, 1);
    let recoverFilterData = searchresult.filter((item) => {
        const {bestBuyQty, volume, totalTradedValue, aboveDaysLowPerChange, current} = item;
        return (totalTradedValue > 0.005 && aboveDaysLowPerChange > 5 && current > 0.5);
    });

    return {
        recoverFilterData
    };
};


const suddenChangeInValue = function suddenChangeInValue(allStocksData, state) {
    let {searchresult = []} = allStocksData;
    let {allStocksScripts = {}} = state;

    // searchresult.splice(Math.random()*allStocksData.pagesummary.totalRecords, 1);

    let allVolatileStocks = searchresult.filter((item) => (((item.bestBuyQty || item.bestSellQty) > item.volume/5) && item.totalTradedValue > 0.005 && (item.percentChange > 2 || item.percentChange < -2)));

    
    let newAllStocksScripts = {};
    let filterSuddenValueGainer = {};
    searchresult.forEach((item) => {
        const {nseScripCode} = item;
        newAllStocksScripts[nseScripCode] = item;

        if(item.volume > (allStocksScripts[nseScripCode] && allStocksScripts[nseScripCode].volume*1.2)) {
            filterSuddenValueGainer[item.nseScripCode] = extractRelevantParams(item);
        }
    });

    return {
        filterSuddenValueGainer : {
            ...state.filterSuddenValueGainer,
            ...filterSuddenValueGainer
        },
        allVolatileStocks,
        allStocksScripts: newAllStocksScripts
    };
};

export default function sampleReducer(alias, initialState = {}) {
    return (state = initialState, action) => {
        switch (action.type) {
            case FALL_FROM_HIGH:
            case FETCH_ONLY_BUYERS:
            case FETCH_ONLY_SELLERS:
            case RECOVER_FROM_LOW:
            case MOST_ACTIVE_BY_VALUE:
            case LOAD_INIT_DATA:
                return Object.assign({}, {
                    ...state,
                    loading:true
                });
            case RESET_APP: {
                return Object.assign({}, {
                    ...stockInitState
                });
            }
            case `${LOAD_INIT_DATA}${SUCCESS}`:
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    initData: action.payload
                });
            case `${FETCH_ONLY_BUYERS}${SUCCESS}`:

                var filterBuyersData = filterBuyersDataFun(action.payload, state);

                return Object.assign({}, {
                    ...state,
                    loading: false,
                    ...filterBuyersData,

                    onlyBuyersData: action.payload
                });
            case `${FETCH_ONLY_SELLERS}${SUCCESS}`:

                var filterSellersData = filterSellesDataFun(action.payload, state);

                return Object.assign({}, {
                    ...state,
                    loading: false,
                    ...filterSellersData,
                    onlySellersData: action.payload
                });
            case SET_OPEN_INTEREST:
                var filterOpenInterest = filterOpenInterestUtil(action.payload, state);
                return Object.assign({}, {
                    ...state,
                    openInterest: action.payload,
                    filterOpenInterest
                });
            case `${RECOVER_FROM_LOW}${SUCCESS}`:

                var filterRecoverFromLowData = filterRecoverFromLow(action.payload, state);
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    ...filterRecoverFromLowData,
                    recoverFromLowData: action.payload
                });
            case `${FALL_FROM_HIGH}${SUCCESS}`:

                var filterFallFromHighData = filterFallFromHigh(action.payload, state);
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    ...filterFallFromHighData,
                    fallFromHighData: action.payload
                });
            case `${MOST_ACTIVE_BY_VALUE}${SUCCESS}`:
                var suddenValueChange = suddenChangeInValue(action.payload, state);
                var itemKeys = Object.keys(action.payload.searchresult[0]);
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    ...suddenValueChange,
                    mostActiveByValueAllStocks: action.payload,
                    itemKeys
                });
            default:
                return state;
        }
    };
}

