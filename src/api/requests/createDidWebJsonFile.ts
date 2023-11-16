import axios, { AxiosResponse } from '../axios';

export type CreateDidWebJsonFilePayload = {
  domain: string;
};

export type CreateDidWebJsonFileResponse = {
  jsonFileContent: string;
};

export const createDidWebJsonFile = (payload: CreateDidWebJsonFilePayload) =>
  axios.post<
    CreateDidWebJsonFilePayload,
    AxiosResponse<CreateDidWebJsonFileResponse, CreateDidWebJsonFilePayload>
  >('/verification/did-web/create-file', payload);
