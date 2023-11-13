import { rest } from 'msw';
import {
  GetIssuersBySelectedCredentialsPayload,
  GetIssuersBySelectedCredentialsResponse,
} from '@/api/requests/getIssuersBySelectedCredentials';
import {
  GetRequestableCredentialsPayload,
  GetRequestableCredentialsResponse,
} from '@/api/requests/getRequestableCredentials';
import { SendCredentialsRequestPayload } from '@/api/requests/sendCredentialsRequest';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { GetIssuerCredentialsResponse } from '@/api/requests/getIssuerCredentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { DEFAULT_MOCK_DELAY, MOCK_API_URL } from '../config';
import { MOCK_CREDENTIALS, MOCK_ISSUERS } from '../constants';

export const credentialsHandlers = [
  rest.get<GetIssuersBySelectedCredentialsPayload>(
    `${MOCK_API_URL}/creator/credentials/issuers`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      const issuerData = [MOCK_ISSUERS[0], MOCK_ISSUERS[3]];

      if (!issuerData) {
        return res(delay, ctx.status(404));
      }

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetIssuersBySelectedCredentialsResponse>({
          issuers: issuerData,
        }),
      );
    },
  ),
  rest.get<GetRequestableCredentialsPayload>(
    `${MOCK_API_URL}/creator/credentials`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetRequestableCredentialsResponse>({
          credentials: MOCK_CREDENTIALS.map(
            (credential) =>
              ({
                id: credential.id,
                type: credential.type,
                data: {
                  ...('companyName' in credential.data
                    ? { companyName: credential.data.companyName }
                    : {}),
                },
              }) as VerifiedCredentialsUnion,
          ),
        }),
      );
    },
  ),
  rest.get<GetIssuerCredentialsResponse>(
    `${MOCK_API_URL}/issuer/credentials`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetIssuerCredentialsResponse>({
          credentials: [
            {
              id: 'issuer-member-credential-id-1',
              type: CredentialType.Member,
              status: CredentialVerificationStatus.Success,
              data: {
                requirements: 'Info about requirements',
                validity: '1 year',
              },
            },
          ],
        }),
      );
    },
  ),
  rest.post<SendCredentialsRequestPayload>(
    `${MOCK_API_URL}/creator/credentials/request`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(201));
    },
  ),
];
