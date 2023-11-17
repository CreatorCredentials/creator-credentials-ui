import { rest } from 'msw';
import {
  GetIssuerCreatorsResponse,
  GetIssuerCreatorsSearchParams,
} from '@/api/requests/getIssuerCreators';
import { AcceptCreatorConnectionRequestPayload } from '@/api/requests/acceptCreatorConnectionRequest';
import { RejectCreatorConnectionRequestPayload } from '@/api/requests/rejectCreatorConnectionRequest';
import { GetCredentialsRequestDetailsResponse } from '@/api/requests/getCredentialsRequestDetails';
import { DEFAULT_MOCK_DELAY, MOCK_API_URL } from '../config';
import { MOCK_CREATORS, MOCK_CREDENTIALS } from '../constants';

export const creatorsHandlers = [
  rest.get<never, GetIssuerCreatorsSearchParams>(
    `${MOCK_API_URL}/issuer/creators`,
    (req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);
      const url = new URL(req.url);

      const status = url.searchParams.get('status') || '';
      const search = url.searchParams.get('search') || '';

      const filteredCreators = MOCK_CREATORS.filter(
        (creator) =>
          creator.status === status && creator.title.includes(search),
      );

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetIssuerCreatorsResponse>({
          creators: filteredCreators,
        }),
      );
    },
  ),
  rest.get<never, { creatorId: string }>(
    `${MOCK_API_URL}/issuer/creators/:creatorId`,
    (req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);
      const creatorId = req.params.creatorId;

      const creator = MOCK_CREATORS.find((creator) => creator.id === creatorId);
      const credentials = MOCK_CREDENTIALS;

      if (!creator) {
        return res(delay, ctx.status(404));
      }

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetCredentialsRequestDetailsResponse>({
          creator,
          credentials,
        }),
      );
    },
  ),
  rest.post<AcceptCreatorConnectionRequestPayload>(
    `${MOCK_API_URL}/issuer/creators/accept`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(201));
    },
  ),
  rest.post<RejectCreatorConnectionRequestPayload>(
    `${MOCK_API_URL}/issuer/creators/reject`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(delay, ctx.status(201));
    },
  ),
];
