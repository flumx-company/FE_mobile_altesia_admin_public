import { AltesiaTokenWorkerPlugin } from "../plugins/token.plugin";
import router, { ROUTES } from "../router";
import { resolverFunctions } from "../resolvers/resolver.functions";

export const ErrorInterceptor = (error) => {

    error = error.response.data.data;

    if (error.statusCode === 401 || error.statusCode === 403 || error.code === 'UnauthorizedException') {
        const listOfRoutes = router.getRoutes();
        const curRoute = window.location.pathname;
        const findCurRouteFromList = listOfRoutes.find(item => curRoute.includes(item.path));
        AltesiaTokenWorkerPlugin.clearToken();

        if(findCurRouteFromList) {
            router.push(resolverFunctions._createLoginPath(findCurRouteFromList.path));
        } else {
            router.push(ROUTES.LOGIN)
        }
    }


    return  Promise.reject(error)
};
