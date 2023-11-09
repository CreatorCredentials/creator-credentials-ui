import axios, { AxiosResponse } from '@/api/axios';

export type ConfirmCreatorToIssuerConnectionRequestPayload = {
  issuerId: string;
};

export type ConfirmCreatorToIssuerConnectionRequestResponse = never;

export const confirmCreatorToIssuerConnectionRequest = ({
  issuerId,
}: ConfirmCreatorToIssuerConnectionRequestPayload) =>
  axios.post<
    ConfirmCreatorToIssuerConnectionRequestPayload,
    AxiosResponse<
      ConfirmCreatorToIssuerConnectionRequestResponse,
      ConfirmCreatorToIssuerConnectionRequestPayload
    >
  >(`/creator/issuers/${issuerId}/confirm-request`);
