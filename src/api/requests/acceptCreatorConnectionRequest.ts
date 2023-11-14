import axios, { AxiosResponse } from '@/api/axios';

export type AcceptCreatorConnectionRequestPayload = {
  creatorId: string;
};

export type AcceptCreatorConnectionRequestResponse = never;

export const acceptCreatorConnectionRequest = ({
  creatorId,
}: AcceptCreatorConnectionRequestPayload) =>
  axios.post<
    AcceptCreatorConnectionRequestPayload,
    AxiosResponse<
      AcceptCreatorConnectionRequestResponse,
      AcceptCreatorConnectionRequestPayload
    >
  >(`/issuer/creators/accept`, { creatorId });
