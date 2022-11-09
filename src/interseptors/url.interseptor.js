export const UrlInterceptor = (request) => {
    request.url = `${request.baseURL}${request.url}`;

    return request
};
