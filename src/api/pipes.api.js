import { map, flatMap } from 'rxjs/operators';
import store from '../store/configureStore'
import { requestFailed } from '../actions/sampleAction'
import { ERROR_STATUS } from '../consts/index';

export const simpleMapPipe = map(
    (response) => {
        let responseObj = response.serverResponse;

        if(!response.success){
            store.dispatch(requestFailed(response));
            responseObj = {
                ...response.serverResponse,
                status: ERROR_STATUS
            }
        }
        return responseObj
    });
