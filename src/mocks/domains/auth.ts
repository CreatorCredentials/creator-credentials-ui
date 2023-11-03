import { rest } from 'msw';
import { LoginPayload, LoginResponse } from '@/api/requests/logIn';
import {
  RefreshTokenPayload,
  RefreshTokenResponse,
} from '@/api/requests/refreshToken';
import {
  SignInWithEmailCodePayload,
  SignInWithEmailCodeResponse,
} from '@/api/requests/signInWithEmailCode';
import {
  SignupCreatorPayload,
  SignupCreatorResponse,
} from '@/api/requests/signupCreator';
import {
  SignupIssuerPayload,
  SignupIssuerResponse,
} from '@/api/requests/signupIssuer';
import { BaseUserData } from '@/shared/typings/BaseUserData';
import { UserRole } from '@/shared/typings/UserRole';
import { MOCK_API_URL } from '../config';

const ACCESS_TOKEN = 'XXXYYYZZZ';
const REFRESH_TOKEN = 'ZZZWWWOOODD';

const CODE_TO_USER_MAP: Record<string, BaseUserData> = {
  creator: {
    id: 'creator-id',
    role: UserRole.Creator,
  },
  issuer: {
    id: 'issuer-id',
    role: UserRole.Issuer,
  },
};

export const authHandlers = [
  rest.post<SignInWithEmailCodePayload>(
    `${MOCK_API_URL}/auth/signin/code`,
    async (req, res, ctx) => {
      const { code } = await req.json<SignInWithEmailCodePayload>();
      const delay = ctx.delay(500);

      if (Object.keys(CODE_TO_USER_MAP).includes(code)) {
        return res(
          delay,
          ctx.status(200),
          ctx.json<SignInWithEmailCodeResponse>({
            user: CODE_TO_USER_MAP[code],
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
  rest.post<LoginPayload, LoginResponse>(
    `${MOCK_API_URL}/auth/login`,
    (_req, res, ctx) => {
      const delay = ctx.delay(1000);

      return res(delay, ctx.status(200));
    },
  ),
  rest.post<SignupIssuerPayload, SignupIssuerResponse>(
    `${MOCK_API_URL}/auth/signup/issuer`,
    (_req, res, ctx) => {
      const delay = ctx.delay(1000);

      return res(delay, ctx.status(200));
    },
  ),
  rest.post<SignupCreatorPayload, SignupCreatorResponse>(
    `${MOCK_API_URL}/auth/signup/creator`,
    (_req, res, ctx) => {
      const delay = ctx.delay(1000);

      return res(delay, ctx.status(200));
    },
  ),
];
