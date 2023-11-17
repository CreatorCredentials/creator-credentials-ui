import axios, { AxiosResponse } from '@/api/axios';

export type ConfirmDidWebJsonFileUploadPayload = never;

export type ConfirmDidWebJsonFileUploadResponse = never;

export const confirmDidWebJsonFileUpload = () =>
  axios.post<
    ConfirmDidWebJsonFileUploadPayload,
    AxiosResponse<
      ConfirmDidWebJsonFileUploadResponse,
      ConfirmDidWebJsonFileUploadPayload
    >
  >('/verification/did-web/confirm-upload');
