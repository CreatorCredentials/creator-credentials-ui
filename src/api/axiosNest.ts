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

const nestInstance = axiosStatic.create({
  baseURL: config.NEST_API_URL,
});

nestInstance.interceptors.request.use(onRequest, onRequestError);

export default nestInstance;
export * from 'axios';
