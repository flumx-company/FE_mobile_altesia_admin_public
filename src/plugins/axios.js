import axios from 'axios/index'
require('dotenv').config()

import { ErrorInterceptor } from "../interseptors/error.interseptor";
import { UrlInterceptor } from "../interseptors/url.interseptor";
import { TokenInterceptor } from "../interseptors/token.interseptor";
import { ResponseInterceptor } from "../interseptors/response.interseptor";

const createApi = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_HOST
  });

  axiosInstance.interceptors.request.use(UrlInterceptor);
  axiosInstance.interceptors.request.use(TokenInterceptor);

  axiosInstance.interceptors.response.use(
      ResponseInterceptor,
      ErrorInterceptor
  );

  return axiosInstance;
};

export const $axios = createApi();
