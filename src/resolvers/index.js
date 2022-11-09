// import { VueResolver } from "../../packages/altesia-admin-resolver";
import { resolverFunctions } from "./resolver.functions";
import { ROUTES } from "../router";
import { finishSpinner, startSpinner } from "../../packages/altesia-loading-worker";
import { VueResolver } from "@vuesual/vue-resolver";


export const AltesiaRouterResolver = new VueResolver()
    .registerResolverFirstWorker(resolverFunctions.isUserAuthorized)
    .registerResolverFirstWorkerError(resolverFunctions.isAuthorizedError)
    .registerResolverSecondWorkerError(resolverFunctions.isResolveDataError)
    .registerAfterIntercept(finishSpinner)
    .registerBeforeIntercept(startSpinner);

export const AltesiaRouterResolverByLoginPage = AltesiaRouterResolver.routeInterceptor(
    () => ({}),
    {
        afterIntercept: ({ next }) => {
            next(ROUTES.USERS);
            finishSpinner();
        },
        resolveFirstWorkerError: ({ next }) => {
            next(true);
            finishSpinner();
        },
    }
);
