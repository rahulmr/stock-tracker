import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError} from 'rxjs/operators';
import { getTime } from 'date-fns';
import moment from 'moment';

export const RestMethods = {
    PUT: 'PUT',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    GET: 'GET'
};

class RxPhoenixHttpResponse {
    constructor(success, message, response, code){
        this.success = success;
        this.message = message;
        this.serverResponse = response;
        this.code = code;
    }
}

export default class RxPhoenixHttp {
    constructor(headers = {'Content-Type': 'application/json'}, responseType = 'json'){
        this.requestOptions = this.createReqOptions({headers, responseType});
    } 

    createReqOptions(options){
        const { headers, responseType } = options
        return { headers, responseType };
    }

    isRestMethod(method){
        let is = method == RestMethods.PUT;
        is = is || method == RestMethods.PATCH;
        is = is || method == RestMethods.POST;
        is = is || method == RestMethods.GET;
        is = is || method == RestMethods.DELETE;
        return is;
    }

    validateParams(params){
        const result = {
            valid: true,
            message: ''
        }
        
        const {url, method} = params;

        if(!url || url.trim() === ''){
            result.valid = false;
            result.message = "Url is mandatory for ajax params creation.";
        }

        if(!this.isRestMethod(method)){
            result.valid = false;
            result.message = "`${method} is not a valid Rest method.`";
        }

        return result;
    }

    createAjaxParams(method, url = '', query, body, async){

        const validationRes = this.validateParams({url, method});

        if(!validationRes.valid){
            throw new Error(validationRes.message);
        }

        async = async === true;

        let urlQueryPart = "?";
        let dateStampQueryPart = `timeStamp=${getTime(moment())}`;

        if(query !== '')
            url += `${urlQueryPart}${query}`;

        if(query !== '')
            url += `&${dateStampQueryPart}`;
        else
            url += `${urlQueryPart}${dateStampQueryPart}`
    
        var requestHeaders = this.requestOptions.headers;

        var authToken = "";

        // authToken = this.authentication.getToken();

        // if (authToken) {
        //     requestHeaders['Authorization'] = 'Bearer ' + authToken;
        // }

        return {
            url: url, // URL of the request
            body: body,  // The body of the request
            user: '',
            async: async, // Whether the request is async
            method: method, // Method of the request, such as GET, POST, PUT, PATCH, DELETE
            headers: requestHeaders, // Optional headers
            timeout: null,
            password: null,
            hasContent: body !== '',
            crossDomain: true, //true if a cross domain request, else false
            withCredentials: false,
            createXHR: function () {  //a function to override if you need to use an alternate XMLHttpRequest implementation
                return new XMLHttpRequest();  
            }, 
            progressSubscriber: null,
            responseType: this.requestOptions.responseType
        }
    }

    handleSuccess(response){
        const internalResponse = new RxPhoenixHttpResponse(true, '', response.response, response.status);
        return internalResponse;
    }

    handleError(error){

        const internalResponse = new RxPhoenixHttpResponse(false, `${error.name}:  ${error.message}`, error.response || {}, error.status);
        // alert(error.message);
        return of(internalResponse);
    }

    getIdQuery(id = -1){
        return id !== -1 ? id : '';
    }

    getId(url, id){
        return this.call(RestMethods.GET, url, '', this.getIdQuery(id));
    }

    get(url, query){
        return this.call(RestMethods.GET, url, '', query);
    }

    put(url, id, payload){
        return this.call(RestMethods.PUT, url, payload, this.getIdQuery(id));
    }

    patch(url, id, payload){
        return this.call(RestMethods.PATCH, url, payload, this.getIdQuery(id));
    }

    post(url, payload, queryParams = ''){
        return this.call(RestMethods.POST, url, payload, queryParams);
    }

    delete(url, id = -1){
        if(id === -1)
            throw new Error('Requested deletion with id = -1');

        return this.call(RestMethods.DELETE, url, '', id);
    }

    deleteMultiple(url, idCollection = []){
        if (idCollection.length === 0)
            throw new Error('Requested deletion with empty id collection');

        return this.call(RestMethods.DELETE, url, idCollection);
    }

    call(method, url, body = '', query = ''){
        const params = this.createAjaxParams(method, url, query, body, true);
        return ajax(params).pipe(
            map(ajaxResponse => this.handleSuccess(ajaxResponse)),
            catchError(error => this.handleError(error)),
        )
    }
}