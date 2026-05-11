import axios, { AxiosResponse } from '@/api/axiosNest';
import { getHeaders } from '@/shared/utils/tokenHeader';

export type AcceptCredentialsIssuanceRequestPayload = {
  credentialId: string;
};

export type SupportingCredential = {
  credentialObject: Record<string, unknown>;
  proof: {
    type: string;
    jwt: string;
  };
};

export type AcceptCredentialsIssuanceRequestResponse = {
  challenge: {
    signingInput: string;
    credentialObject: unknown;
    initiatedAt: string;
  };
  commands: string[];
  supportingCredential?: SupportingCredential;
};

export type VerifyAcceptedCredentialSignaturePayload = {
  credentialId: string;
  signature: string;
};

export const acceptCredentialsIssuanceRequest = (
  { credentialId }: AcceptCredentialsIssuanceRequestPayload,
  token: string,
) =>
  axios.post<
    AcceptCredentialsIssuanceRequestPayload,
    AxiosResponse<
      AcceptCredentialsIssuanceRequestResponse,
      AcceptCredentialsIssuanceRequestPayload
    >
  >(`/v1/credentials/${credentialId}/accept`, {}, getHeaders(token));

export const verifyAcceptedCredentialSignature = (
  { credentialId, signature }: VerifyAcceptedCredentialSignaturePayload,
  token: string,
) =>
  axios.post<
    VerifyAcceptedCredentialSignaturePayload,
    AxiosResponse<never, VerifyAcceptedCredentialSignaturePayload>
  >(
    `/v1/credentials/${credentialId}/accept/verify-signature`,
    { signature },
    getHeaders(token),
  );
