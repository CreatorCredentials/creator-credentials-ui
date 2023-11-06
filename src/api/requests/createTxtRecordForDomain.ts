import axios, { AxiosResponse } from '../axios';

export type CreateTxtRecordForDomainPayload = {
  domain: string;
};

export type CreateTxtRecordForDomainResponse = {
  txtRecord: string;
};

export const createTxtRecordForDomain = (domain: string) =>
  axios.post<
    CreateTxtRecordForDomainPayload,
    AxiosResponse<
      CreateTxtRecordForDomainResponse,
      CreateTxtRecordForDomainPayload
    >
  >('/verification/domain/txt-record', { domain });
