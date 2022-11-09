import { ROUTES } from "../router";
import { AltesiaTokenWorkerPlugin } from "../plugins/token.plugin";
import { $api } from "../api";
import { finishSpinner } from "../../packages/altesia-loading-worker";

const $createQuery = (objQuery) => Object
    .keys(objQuery)
    .map((key) => `${key}=${objQuery[key]}`)
    .join('&');

const _createLoginPath = (redirectUrl) => {
    const query = $createQuery({
        redirectUrl
    });

    return `${ROUTES.LOGIN}?${query}`
};

const _checkAsyncIsAdmin = async () => {
    try {
        await $api.AuthRequest.getAdmin();
        return true;
    } catch ( e ) {
        return false;
    }
};

const isUserAuthorized = async (e) => {
    let loginned = AltesiaTokenWorkerPlugin.isToken() && await _checkAsyncIsAdmin();
    return Promise.resolve(!!loginned);
};

const isAuthorizedError = ({ to, next }) => {
    return next(_createLoginPath(to.fullPath));
};

const isResolveDataError = async (error) => {
    // TOAST show
    finishSpinner()
    console.log('TOAST_SHOWED_BY_ERROR', error);
};

export const resolverFunctions = {
    isUserAuthorized,
    isAuthorizedError,
    isResolveDataError,
    _createLoginPath
};
