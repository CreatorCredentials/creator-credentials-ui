import { rest } from 'msw';
import { ConfirmCreatorToIssuerConnectionRequestPayload } from '@/api/requests/confirmCreatorToIssuerConnectionRequest';
import { GetCreatorIssuersResponse } from '@/api/requests/getCreatorIssuers';
import {
  GetIssuerDetailsWithCredentialsPayload,
  GetIssuerDetailsWithCredentialsResponse,
} from '@/api/requests/getIssuerDetailsWithCredentials';
import { DEFAULT_MOCK_DELAY, MOCK_API_URL } from '../config';
import { MOCK_ISSUERS } from '../constants';

export const issuersHandlers = [
  rest.get<GetCreatorIssuersResponse>(
    `${MOCK_API_URL}/creator/issuers`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetCreatorIssuersResponse>({
          issuers: MOCK_ISSUERS,
        }),
      );
    },
  ),
  rest.get<GetIssuerDetailsWithCredentialsPayload>(
    `${MOCK_API_URL}/creator/issuers/:issuerId`,
    (req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);
      const issuerId = req.params.issuerId;

      const issuerData = MOCK_ISSUERS.find((issuer) => issuer.id === issuerId);

      if (!issuerData) {
        return res(delay, ctx.status(404));
      }

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetIssuerDetailsWithCredentialsResponse>({
          issuer: issuerData,
        }),
      );
    },
  ),
  rest.post<ConfirmCreatorToIssuerConnectionRequestPayload>(
    `${MOCK_API_URL}/creator/issuers/:issuerId/confirm-request`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(201));
    },
  ),
];
