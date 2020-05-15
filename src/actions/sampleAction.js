import * as actions from './actionTypes';

export function fetchInitData(data) {
    return {type: actions.LOAD_INIT_DATA, payload: data};
}

export function fetchOnlyBuyers(data) {
    return {type: actions.FETCH_ONLY_BUYERS, payload: data};
}

export function fetchOnlySellers(data) {
    return {type: actions.FETCH_ONLY_SELLERS, payload: data};
}

export function openInterest(data) {
    return {type: actions.SET_OPEN_INTEREST, payload: data};
}

export function fetchRecoverFromLow(data) {
    return {type: actions.RECOVER_FROM_LOW, payload: data};
}

export function fetchFallFromHigh(data) {
    return {type: actions.FALL_FROM_HIGH, payload: data};
}

export function resetApp() {
    return {type: actions.RESET_APP};
}

export function mostActiveByValue(data) {
    return {type: actions.MOST_ACTIVE_BY_VALUE, payload: data};
}

export function fetchInitDataSuccessful(data) {
    return {type: `${actions.LOAD_INIT_DATA}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fetchOnlyBuyersSuccessful(data) {
    if(data.status !== 'error') {
        return {type: `${actions.FETCH_ONLY_BUYERS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
    }
}

export function recoverFromLowSuccessful(data) {
    return {type: `${actions.RECOVER_FROM_LOW}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fallFromHighSuccessful(data) {
    return {type: `${actions.FALL_FROM_HIGH}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}


export function fetchOnlySellersSuccessful(data) {
    if(data.status !== 'error') {
        return {type: `${actions.FETCH_ONLY_SELLERS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
    }
}

export function mostActiveByValueSuccessful(data) {
    return {type: `${actions.MOST_ACTIVE_BY_VALUE}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function requestFailed(payload){
    return {type: actions.REQUEST_FAILED, payload: payload};
}
