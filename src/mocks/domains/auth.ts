import { rest } from 'msw';
import {
  SignInWithEmailCodePayload,
  SignInWithEmailCodeResponse,
} from '@/api/requests/signInWithEmailCode';
import {
  RefreshTokenPayload,
  RefreshTokenResponse,
} from '@/api/requests/refreshToken';
import { MOCK_API_URL } from '../config';

const LOGIN_CODE = '123456';
const ACCESS_TOKEN = 'XXXYYYZZZ';
const REFRESH_TOKEN = 'ZZZWWWOOODD';

export const authHandlers = [
  rest.post<SignInWithEmailCodePayload>(
    `${MOCK_API_URL}/auth/signin/code`,
    async (req, res, ctx) => {
      const { code } = await req.json<SignInWithEmailCodePayload>();
      const delay = ctx.delay(500);

      if (code === LOGIN_CODE) {
        return res(
          delay,
          ctx.status(200),
          ctx.json<SignInWithEmailCodeResponse>({
            user: {
              id: '123',
              name: 'John Doe',
            },
            backendTokens: {
              accessToken: ACCESS_TOKEN,
              refreshToken: REFRESH_TOKEN,
              expiresIn: new Date().getTime() + 1000 * 60 * 10, // 10 minutes
            },
          }),
        );
      }

      return res(delay, ctx.status(401));
    },
  ),
  rest.post<RefreshTokenPayload>(
    `${MOCK_API_URL}/auth/refresh`,
    (req, res, ctx) => {
      const token = req.headers.get('Authorization')?.split(' ')[1];

      const delay = ctx.delay(500);

      if (REFRESH_TOKEN === token) {
        return res(
          delay,
          ctx.json<RefreshTokenResponse>({
            accessToken: ACCESS_TOKEN,
            refreshToken: REFRESH_TOKEN,
            expiresIn: new Date().getTime() + 1000 * 60 * 10, // 10 minutes
          }),
          ctx.status(200),
        );
      }

      return res(delay, ctx.status(401));
    },
  ),
];
