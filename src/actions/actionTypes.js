export const LOAD_INIT_DATA = 'LOAD_INIT_DATA';
export const LOAD_INIT_DATA_SUCCESS = 'LOAD_INIT_DATA_SUCCESS';
export const APP_STORE_ERROR = 'APP_STORE_ERROR';
export const REQUEST_FAILED = 'REQUEST_FAILED';

export const FETCH_ONLY_BUYERS = 'FETCH_ONLY_BUYERS';
export const FETCH_ONLY_SELLERS = 'FETCH_ONLY_SELLERS';
export const SET_OPEN_INTEREST = 'SET_OPEN_INTEREST';
export const RECOVER_FROM_LOW = 'RECOVER_FROM_LOW';
export const FALL_FROM_HIGH = 'FALL_FROM_HIGH';
export const MOST_ACTIVE_BY_VALUE = 'MOST_ACTIVE_BY_VALUE';

export const RESET_APP = 'RESET_APP';


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