import {map, switchMap, mergeMap, takeUntil} from 'rxjs/operators';
import {from as fromRxOperator} from 'rxjs';
import {camelCase, isEmpty} from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import {fetchInitDataSuccessful, fetchOnlyBuyersSuccessful, fallFromHighSuccessful,
    fetchOnlySellersSuccessful, recoverFromLowSuccessful, mostActiveByValueSuccessful} from '../actions/sampleAction';
import {combineEpics} from 'redux-observable';

const API_NAME = 'stockAppApi';

const {LOAD_INIT_DATA, FETCH_ONLY_BUYERS, FETCH_ONLY_SELLERS} = actionTypes;

const fetchOpenInterestEpic = (action$, state$, {apis}) => {
    const action = LOAD_INIT_DATA;
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

const fetchRecoverFromLowEpic = (action$, state$, {apis}) => {
    const action = actionTypes.RECOVER_FROM_LOW;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                
                return apis[API_NAME].fetchRecoverFromLowApi$(payload);
            }),
            map((result) => recoverFromLowSuccessful(result))
        );
};

const fetchFallFromHighEpic = (action$, state$, {apis}) => {
    const action = actionTypes.FALL_FROM_HIGH;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;

                return apis[API_NAME].fetchFallFromHighApi$(payload);
            }),
            map((result) => fallFromHighSuccessful(result))
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
        fetchRecoverFromLowEpic,
        fetchFallFromHighEpic,
        fetchMostActiveByValueEpic
    );
};

export default stockAppEpic;