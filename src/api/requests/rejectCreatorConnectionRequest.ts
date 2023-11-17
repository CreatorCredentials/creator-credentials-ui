import axios, { AxiosResponse } from '@/api/axios';

export type RejectCreatorConnectionRequestPayload = {
  creatorId: string;
};

export type RejectCreatorConnectionRequestResponse = never;

export const rejectCreatorConnectionRequest = ({
  creatorId,
}: RejectCreatorConnectionRequestPayload) =>
  axios.post<
    RejectCreatorConnectionRequestPayload,
    AxiosResponse<
      RejectCreatorConnectionRequestResponse,
      RejectCreatorConnectionRequestPayload
    >
  >(`/issuer/creators/reject`, { creatorId });
