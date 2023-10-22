/* eslint-disable no-restricted-imports */
import axiosStatic, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { config } from '@/shared/constants/config';

const onRequest = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  if (!config.headers.Authorization) {
    const session = await getSession();
    config.headers.Authorization = `Bearer ${session?.backendTokens?.accessToken}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);

const instance = axiosStatic.create({
  baseURL: config.API_URL,
});

instance.interceptors.request.use(onRequest, onRequestError);

export default instance;

export * from 'axios';
