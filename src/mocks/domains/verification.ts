import { rest } from 'msw';
import { GetCreatorVerifiedCredentialsResponse } from '@/api/requests/getCreatorVerifiedCredentials';
import {
  GenerateMetaMaskNoncePayload,
  GenerateMetaMaskNonceResponse,
} from '@/api/requests/generateMetaMaskNonce';
import { MOCK_API_URL } from '../config';

export const verificationHandlers = [
  rest.get<GetCreatorVerifiedCredentialsResponse>(
    `${MOCK_API_URL}/users/vc`,
    (_req, res, ctx) => {
      const delay = ctx.delay(500);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetCreatorVerifiedCredentialsResponse>({
          metaMask: null,
        }),
      );
    },
  ),
  rest.post<GenerateMetaMaskNoncePayload, GenerateMetaMaskNonceResponse>(
    `${MOCK_API_URL}/users/nonce`,
    (_req, res, ctx) => {
      const delay = ctx.delay(1000);
      const randomNonce = Math.floor(Math.random() * 1000000000);

      return res(delay, ctx.status(200), ctx.json({ nonce: randomNonce }));
    },
  ),
  rest.post<GenerateMetaMaskNoncePayload, GenerateMetaMaskNonceResponse>(
    `${MOCK_API_URL}/users/:walletAddress`,
    (_req, res, ctx) => {
      const delay = ctx.delay(1000);

      return res(delay, ctx.status(200));
    },
  ),
];
