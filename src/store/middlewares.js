import { appStoreError } from "../actions/actionTypes";

export function errorHandlingMiddleware() {
    return (next) => (action) => {
        try {
            return next(action);
        }
        catch (error) {
            next(appStoreError({
                action,
                error: {
                    message: error.message,
                    stack: error.stack
                }
            }));

            throw error;
        }
    };
}