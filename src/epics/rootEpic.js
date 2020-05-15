import {combineEpics} from 'redux-observable';
import {ajax} from 'rxjs/ajax';
import stockAppEpic from './stockAppDataEpics';

const rootEpic = (...args) => combineEpics(
    stockAppEpic()
)(...args, {ajax});

export default rootEpic;