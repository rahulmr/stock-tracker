import RxPhoenixHttp from './RxPhoenixHttp/RxPhoenixHttp';
import {simpleMapPipe} from './pipes.api';

const http = new RxPhoenixHttp();
const httpHTML = new RxPhoenixHttp({headers: {'Content-Type': 'text/plain'}});

const economicTimesBaseURL = "https://etmarketsapis.indiatimes.com/ET_Stats";


const commonQueryParam = {
    pageno: 1,
    pagesize: 300
};

const getQueryParams = (parameters) => {
    return Object.keys(parameters).map(paramKey => `${paramKey}=${parameters[paramKey]}`).join('&');
};

const fetchOpenInterestApi$ = () => {
    return httpHTML.get('https://www.moneycontrol.com/stocks/fno/marketstats/futures/openint_inc/homebody.php');
};

const fetchOnlyBuyersApi$ = (queryParam) => {
    let queryParams = {
        ...commonQueryParam,
        sortby: 'bestBuyQty',
        sortorder: 'desc',
        service: 'buyers',
        ...queryParam
    };
    queryParams = getQueryParams(queryParams);
    return http.get(economicTimesBaseURL + '/onlybuyer', queryParams).pipe(simpleMapPipe);
};


const fetchOnlySellersApi$ = (queryParam) => {
    let queryParams = {
        ...commonQueryParam,
        sortby: 'bestSellQty',
        sortorder: 'desc',
        service: 'sellers',
        ...queryParam
    };
    queryParams = getQueryParams(queryParams);
    return http.get(economicTimesBaseURL + '/onlyseller', queryParams).pipe(simpleMapPipe);
};

const fetchRecoverFromLowApi$ = (queryParam) => {
    let queryParams = {
        ...commonQueryParam,
        sortby: 'aboveDaysLowPerChange',
        sortorder: 'desc',
        service: 'intradaylow',
        ...queryParam
    };
    queryParams = getQueryParams(queryParams);
    return http.get(economicTimesBaseURL + '/recoveryfromlow', queryParams).pipe(simpleMapPipe);
};

const fetchFallFromHighApi$ = (queryParam) => {
    let queryParams = {
        ...commonQueryParam,
        sortby: 'belowDaysHighPerChange',
        sortorder: 'asc',
        service: 'intradayhigh',
        ...queryParam
    };
    queryParams = getQueryParams(queryParams);
    return http.get(economicTimesBaseURL + '/fallfromhigh', queryParams).pipe(simpleMapPipe);
};


const fetchActiveByValueApi$ = (queryParam) => {
    let queryParams = {
        ...commonQueryParam,
        sortby: 'value',
        sortorder: 'desc',
        service: 'valuemovers',
        ...queryParam
    };
    queryParams = getQueryParams(queryParams);
    return http.get(economicTimesBaseURL + '/moversvalue', queryParams).pipe(simpleMapPipe);
};




export {
    fetchOpenInterestApi$,
    fetchOnlyBuyersApi$,
    fetchOnlySellersApi$,
    fetchRecoverFromLowApi$,
    fetchFallFromHighApi$,
    fetchActiveByValueApi$
};
