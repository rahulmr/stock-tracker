import {combineReducers} from 'redux';
import sampleReducer from './sampleReducer';
import stockInitState from '../initialState/stockState';

import {enableBatching} from 'redux-batched-actions';

let savedData = window.localStorage.getItem('stockdata');
if(savedData) {
    savedData = JSON.parse(savedData);
}

const rootReducer = combineReducers({
    sampleReducer: sampleReducer('', {...stockInitState, ...savedData})
});

export default enableBatching((rootReducer));