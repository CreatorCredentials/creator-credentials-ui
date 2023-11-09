import axios, { AxiosResponse } from '@/api/axios';

export type ConfirmDomainTxtRecordCreationPayload = never;

export type ConfirmDomainTxtRecordCreationResponse = never;

export const confirmDomainTxtRecordCreation = () =>
  axios.post<
    ConfirmDomainTxtRecordCreationPayload,
    AxiosResponse<
      ConfirmDomainTxtRecordCreationResponse,
      ConfirmDomainTxtRecordCreationPayload
    >
  >('/verification/domain/confirm');
