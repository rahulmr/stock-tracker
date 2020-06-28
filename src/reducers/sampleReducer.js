

import {func} from 'prop-types';

import stockInitState from '../initialState/stockState';

import {LOAD_INIT_DATA, API_SUFFIX, FETCH_ONLY_BUYERS, FALL_FROM_HIGH, MOST_ACTIVE_BY_VALUE,
    FETCH_ONLY_SELLERS, SET_OPEN_INTEREST, RECOVER_FROM_LOW, RESET_APP} from '../actions/actionTypes';
import {isEmpty} from 'rxjs-compat/operator/isEmpty';

const {SUCCESS} = API_SUFFIX;


const MY_HOLDING = ['LASA', 'VARROC', 'USHAMART', 'HDIL', 'L&TFH', 'JAGRAN', 
 'ADANITRANS', 'CHOLAFIN', 'REPCOHOME', 'HSCL', 'SBIN', 'ICICIBANK', 'BHEL', 'SPAL', 'WELCORP',
'MAGMA', 'JKIL', 'CONFIPET', 'AVONMORE', 'SHAILY', 'ZENTEC', 'BANKINDIA', 'AUBANK', 'TATASTLBSL',
'CANBK', 'TECHNOFAB', 'ACE', 'BALPHARMA', 'WESTLIFE', 'JIYAECO', 'PRAJIND', 'ONGC', 'HTMEDIA',
'THOMASCOOK', 'SYNCOMF', 'DBCORP', 'RECLTD', 'SHRIRAMEPC', 'RADIOCITY', 'SAFARIND'];

const filterOpenInterestUtil = function filterOpenInterestUtil(allOIMap, state) {
    let myMap = {};
    Object.keys(allOIMap).forEach((item) => {
        const value = allOIMap[item];
        if(parseFloat(value['Increase(%)'], 10) > 5 && parseFloat(value['Chg(Rs)Chg (%)'].split(/\s+/g)[1], 10)) {
            myMap[item] = {...allOIMap[item]};
        }
    });
    return myMap;
};

const priceVolumeCriteria = function priceVolumeCriteria(type, item) {
    const {totalTradedValue, aboveDaysLowPerChange, volumeInThousand, bestSellQty,
        bestBuyQty, volume, month6HighPrice, month6LowPrice, current} = item;
    // if((totalTradedValue > 0.01 || volumeInThousand > 20) && (bestBuyQty > volume/2 || bestSellQty > volume/2)) {
    //     if((type === 'gain' && month6HighPrice/1.3 > current) ||
    //         (type === 'loss' && month6LowPrice < current/1.3)) {
    //         return true;
    //     }
    //     // return true;
    // }
    if(totalTradedValue > 0.02) {
        return true;
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
        totalTradedValue: item.totalTradedValue,
        ticker: item.ticker
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

    let onlyBuyersWithHighDemand = searchresult.filter((item) => item.totalTradedValue > 0.1);

    let onlyQualityStocks = searchresult.filter((item) => item.current > 1);

    onlyQualityStocks.forEach((item) => {
        latestDictDataFormat[item.ticker] = item;
        const {ticker} = item;
        if(!dictDataFormat[ticker] && priceVolumeCriteria('gain', item)) {
            addedToBuyers[item.ticker] = extractRelevantParams(item);
        }
    });
    const dictDataFormatKeys = Object.keys(dictDataFormat);
    dictDataFormatKeys.forEach((item) => {
        // item.bestSellQty > 0
        if(!latestDictDataFormat[item] && priceVolumeCriteria('loss', item)) {
            const getItem = dictDataFormat[item];
            removedFromBuyers[getItem.ticker] = extractRelevantParams(getItem);
        }
    });

    /******* Additional Condition for removed from only buyers */

    const existingOnlyBuyers = Object.keys(state.addedToBuyers);
    existingOnlyBuyers.forEach((item) => {
        // item.bestSellQty > 0
        if(!latestDictDataFormat[item]) {
            const getItem = state.addedToBuyers[item];
            removedFromBuyers[getItem.ticker] = extractRelevantParams(getItem);
        }
    });
    /**************************************************************** */

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
    };
};



const filterSellesDataFun = function filterSellesDataFun(sellersData, state) {
    let {searchresult = []} = sellersData;
    // searchresult.splice(Math.random()*sellersData.pagesummary.totalRecords, 1);
    const {dictSellerDataFormat = {}} = state;
    // const dataLen = pagesummary.totalRecords;
    let removedFromSellers = {};
    let addedToSellers = {};
    let latestDictDataFormat = {};

    let onlySellersWithHighDemand = searchresult.filter((item) => item.totalTradedValue > 0.1);

    let onlyQualityStocks = searchresult.filter((item) => item.current > 1);

    onlyQualityStocks.forEach((item) => {
        latestDictDataFormat[item.ticker] = item;
        if(!dictSellerDataFormat[item.ticker] && priceVolumeCriteria('loss', item)) {
            addedToSellers[item.ticker] = extractRelevantParams(item);
        }
    });
    const dictDataFormatKeys = Object.keys(dictSellerDataFormat);
    dictDataFormatKeys.forEach((item) => {
        // item.bestBuyQty > 0
        if(!latestDictDataFormat[item] && priceVolumeCriteria('gain', item)) {
            const getItem = dictSellerDataFormat[item];
            removedFromSellers[getItem.ticker] = extractRelevantParams(getItem);
        }
    });

    /******* Additional Condition for removed from only sellers */

    const existingOnlySellers = Object.keys(state.removedFromSellers);
    existingOnlySellers.forEach((item) => {
        // item.bestSellQty > 0
        if(!latestDictDataFormat[item]) {
            const getItem = state.removedFromSellers[item];
            removedFromSellers[getItem.ticker] = extractRelevantParams(getItem);
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
            ...addedToSellers,
            ...state.addedToSellers
        },
        onlySellersWithHighDemand
    };
};

const filterFallFromHigh = function filterFallFromHigh(fallFromHigh, state) {
    let {searchresult = []} = fallFromHigh;
    // searchresult.splice(Math.random()*fallFromHigh.pagesummary.totalRecords, 1);
    let filterFallFromHighData = searchresult.filter((item) => {
        const {bestBuyQty, volume, totalTradedValue, belowDaysHighPerChange, current} = item;
        return (totalTradedValue > 0.03 && belowDaysHighPerChange < -5 && current > 0.5);
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
        return (totalTradedValue > 0.03 && aboveDaysLowPerChange > 5 && current > 0.5);
    });

    return {
        recoverFilterData
    };
};


const suddenChangeInValue = function suddenChangeInValue(allStocksData, state) {
    let {searchresult = []} = allStocksData;
    let {allStocksScripts = {}} = state;

    // searchresult.splice(Math.random()*allStocksData.pagesummary.totalRecords, 1);
    // searchresult = searchresult.slice(1, 10);
    let allVolatileStocks = searchresult.filter((item) => item.totalTradedValue > 0.1 && (item.percentChange > 2 || item.percentChange < -2));

    allVolatileStocks = allVolatileStocks.map((item) => {
        // let buyToSell = null;
        // if(item.bestSellQty === 0) {
        //     buyToSell = 1000000;
        // } else if(item.bestBuyQty === 0) {
        //     buyToSell = 0;
        // } else {
        //     buyToSell = item.bestBuyQty/item.bestSellQty;
        // }
        return {
            ...item
            // buyToSellRatio: buyToSell
        };
    });
    let newAllStocksScripts = {};
    let totalTradedValue = 0;
    let filterSuddenValueGainer = {};

    let extremeSuddenSell = {};
    let extremeSuddenBuy = {};

    let myHoldings = {};

    let fallInYear = {};

    searchresult.forEach((item) => {
        const {ticker} = item;
        // newAllStocksScripts[ticker] = {...item, bestBuyQty: item.bestBuyQty*parseInt((Math.random()*40))};
       
        let buyToSell = null;
        // if(item.bestSellQty === 0) {
        //     buyToSell = 1000000;
        // } else if(item.bestBuyQty === 0) {
        //     buyToSell = 0;
        // } else {
        //     buyToSell = item.bestBuyQty/item.bestSellQty;
        // }
        newAllStocksScripts[ticker] = {...item, buyToSellRatio: buyToSell};
        totalTradedValue = totalTradedValue + item.totalTradedValue;
        if(item.volume > (allStocksScripts[ticker] && allStocksScripts[ticker].volume*1.2)) {
            filterSuddenValueGainer[item.ticker] = {...extractRelevantParams(item), buyToSellRatio: buyToSell};
        }


        if(item.current > (allStocksScripts[ticker] && allStocksScripts[ticker].current * 1.03) &&
           item.aboveDaysLowPerChange > allStocksScripts[ticker].aboveDaysLowPerChange * 1.03 &&
            totalTradedValue > 0.1) {

            extremeSuddenBuy[item.ticker] = {...extractRelevantParams(item), lastPrice: allStocksScripts[ticker].current, currentPrice: item.current};
        }
        if(item.current > (allStocksScripts[ticker] && allStocksScripts[ticker].current * 1.03) &&
           item.belowDaysHighPerChange > allStocksScripts[ticker].belowDaysHighPerChange * 1.03 &&
            totalTradedValue > 0.1) {
            extremeSuddenSell[item.ticker] = {...extractRelevantParams(item), lastPrice: allStocksScripts[ticker].current, currentPrice: item.current};
        }


        if((item.current < item.yearHighPrice/2.5 || item.current < item.month6HighPrice/2.5) && item.totalTradedValue > 0.001) {
            fallInYear[item.ticker] = {...extractRelevantParams(item)};
        }

        const myItem = MY_HOLDING.find((item1) => item1.includes(item[ticker]) || item.ticker.includes(item1));
        if(myItem) {
            myHoldings[item.ticker] = {...extractRelevantParams(item)};
        }

    });


    return {
        filterSuddenValueGainer : {
            ...state.filterSuddenValueGainer,
            ...filterSuddenValueGainer
        },
        extremeSuddenBuy : {
            ...state.extremeSuddenBuy,
            ...extremeSuddenBuy
        },
        extremeSuddenSell : {
            ...state.extremeSuddenSell,
            ...extremeSuddenSell
        },
        myHoldings,
        fallInYear,
        allVolatileStocks,
        allStocksScripts: {...newAllStocksScripts},
        totalTradedValue

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

