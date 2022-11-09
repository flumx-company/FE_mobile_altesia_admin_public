import { AltesiaTokenWorkerPlugin } from "../plugins/token.plugin";
export const TokenInterceptor = (request) => {
    const jwt = AltesiaTokenWorkerPlugin.getToken();

    if (jwt) {
        request.headers.Authorization = `Bearer ${jwt}`;
        request.headers.Accept = `application/json`
    }

    return request
};
