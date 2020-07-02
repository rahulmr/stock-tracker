export const LOAD_OPEN_INTEREST = 'LOAD_OPEN_INTEREST';
export const LOAD_OPEN_INTEREST_SUCCESS = 'LOAD_OPEN_INTEREST_SUCCESS';
export const APP_STORE_ERROR = 'APP_STORE_ERROR';
export const REQUEST_FAILED = 'REQUEST_FAILED';

export const FETCH_ONLY_BUYERS = 'FETCH_ONLY_BUYERS';
export const FETCH_ONLY_SELLERS = 'FETCH_ONLY_SELLERS';
export const SET_OPEN_INTEREST = 'SET_OPEN_INTEREST';

export const MOST_ACTIVE_BY_VALUE = 'MOST_ACTIVE_BY_VALUE';

export const RESET_APP = 'RESET_APP';

export const UPDATE_SELECTED_STOCKS = 'UPDATE_SELECTED_STOCKS';
export const TRACK_SELECTED_STOCKS = 'TRACK_SELECTED_STOCKS';

export const UPDATE_REFRESH_RATE = 'UPDATE_REFRESH_RATE';

export const API_SUFFIX = {
    SUCCESS: '_SUCCESS',
    IN_PROGRESS: '_IN_PROGRESS',
    FAILURE: '_FAILURE'
};

export function appStoreError(error) {
    return {
        type: APP_STORE_ERROR,
        payload: {
            ...error
        }
    };
}