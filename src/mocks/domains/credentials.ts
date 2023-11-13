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
import { MOCK_API_URL } from '../config';
import { MOCK_CREDENTIALS, MOCK_ISSUERS } from '../constants';

export const credentialsHandlers = [
  rest.get<GetIssuersBySelectedCredentialsPayload>(
    `${MOCK_API_URL}/creator/credentials/issuers`,
    (_req, res, ctx) => {
      const delay = ctx.delay(500);

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
      const delay = ctx.delay(500);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetRequestableCredentialsResponse>({
          credentials: MOCK_CREDENTIALS,
        }),
      );
    },
  ),
  rest.post<SendCredentialsRequestPayload>(
    `${MOCK_API_URL}/creator/credentials/request`,
    (_req, res, ctx) => {
      const delay = ctx.delay(500);

      return res(delay, ctx.status(201));
    },
  ),
];
