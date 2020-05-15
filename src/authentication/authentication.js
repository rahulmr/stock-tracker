import store from '../store/configureStore'
import userManager from '../utils/userManager';
import { from, of } from 'rxjs'
import { flatMap, switchMap } from 'rxjs/operators';
import * as _ from 'lodash'


const getUser$ = from(userManager.getUser());

export const getUserOrSignin$ = getUser$.pipe(
    switchMap(user => {
        if (user)
            return of(user)
        
        return from(userManager.signinRedirect()).pipe(
            flatMap(() => {
                return from(userManager.signinRedirectCallback()).pipe(
                    flatMap(() => {
                        return getUser$;
                    })
                )
            })         
        );
    })
);

export class IdentityServerAuthentication {
    constructor() {
        this.subscription = null;    
        this.accessToken = "";
    }

    handleChange() {
        var state = this.store.getState();

        this.accessToken = _.get(state, 'oidcReducer.user.access_token', "");
    }

    ensureSubscription() {
        if (this.subscription == null) {
            this.store = store;
            this.subscription = store.subscribe(this.handleChange.bind(this));
            this.handleChange();
        }
    }

    getToken() {
        this.ensureSubscription();

        return this.accessToken;
    }
}