import { rest } from 'msw';
import { GetIssuerProfileResponse } from '@/api/requests/getIssuerProfile';
import { DEFAULT_MOCK_DELAY, MOCK_API_URL } from '../config';

export const profileHandlers = [
  rest.get<GetIssuerProfileResponse>(
    `${MOCK_API_URL}/issuer/profile`,
    (_req, res, ctx) => {
      const delay = ctx.delay(DEFAULT_MOCK_DELAY);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetIssuerProfileResponse>({
          companyName: 'Liccium Ltd',
          description:
            'Liccium Trust Engine, supporting creators to make verifiable declarations of original content',
          domain: 'liccium.com',
          email: 'alan@liccium.com',
        }),
      );
    },
  ),
];
