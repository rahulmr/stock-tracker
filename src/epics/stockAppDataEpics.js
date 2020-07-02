import {map, switchMap, mergeMap, takeUntil} from 'rxjs/operators';
import {from as fromRxOperator} from 'rxjs';
import {camelCase, isEmpty} from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import {fetchInitDataSuccessful, fetchOnlyBuyersSuccessful,
    fetchOnlySellersSuccessful, mostActiveByValueSuccessful} from '../actions/sampleAction';
import {combineEpics} from 'redux-observable';

const API_NAME = 'stockAppApi';

const {LOAD_OPEN_INTEREST, FETCH_ONLY_BUYERS, FETCH_ONLY_SELLERS} = actionTypes;

const fetchOpenInterestEpic = (action$, state$, {apis}) => {
    const action = LOAD_OPEN_INTEREST;
    return action$
        .ofType(action)
        .pipe(
            switchMap(() => {
                return apis[API_NAME].fetchOpenInterestApi$();
            }),
            map((result) => fetchInitDataSuccessful(result))
        );
};

const fetchOnlyBuyersEpic = (action$, state$, {apis}) => {
    const action = FETCH_ONLY_BUYERS;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                
                return apis[API_NAME].fetchOnlyBuyersApi$(payload);
            }),
            map((result) => fetchOnlyBuyersSuccessful(result))
        );
};


const fetchOnlySellerEpic = (action$, state$, {apis}) => {
    const action = FETCH_ONLY_SELLERS;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                
                return apis[API_NAME].fetchOnlySellersApi$(payload);
            }),
            map((result) => fetchOnlySellersSuccessful(result))
        );
};

const fetchMostActiveByValueEpic = (action$, state$, {apis}) => {
    const action = actionTypes.MOST_ACTIVE_BY_VALUE;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                
                return apis[API_NAME].fetchActiveByValueApi$(payload);
            }),
            map((result) => mostActiveByValueSuccessful(result))
        );
};


// COMBINE ALL EPICS
const stockAppEpic = () => {
    return combineEpics(
        fetchOpenInterestEpic,
        fetchOnlyBuyersEpic,
        fetchOnlySellerEpic,
        fetchMostActiveByValueEpic
    );
};

export default stockAppEpic;