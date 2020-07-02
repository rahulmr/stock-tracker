import * as actions from './actionTypes';

export function fetchInitData(data) {
    return {type: actions.LOAD_OPEN_INTEREST, payload: data};
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

export function updateSelectedStocks(data) {
    return {type: actions.UPDATE_SELECTED_STOCKS, payload: data};
}

export function trackStocks(trackSelected) {
    return {type: actions.TRACK_SELECTED_STOCKS, payload: trackSelected};
}

export function updateRefreshRate(refreshRate)  {
    return {type: actions.UPDATE_REFRESH_RATE, payload: refreshRate};
}



export function resetApp() {
    return {type: actions.RESET_APP};
}

export function mostActiveByValue(data) {
    return {type: actions.MOST_ACTIVE_BY_VALUE, payload: data};
}

export function fetchInitDataSuccessful(data) {
    return {type: `${actions.LOAD_OPEN_INTEREST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fetchOnlyBuyersSuccessful(data) {
    if(data.status !== 'error') {
        return {type: `${actions.FETCH_ONLY_BUYERS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
    }
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
