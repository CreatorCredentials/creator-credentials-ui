import { rest } from 'msw';
import {
  SignupCreatorPayload,
  SignupCreatorResponse,
} from '@/api/requests/signupCreator';
import { MOCK_API_URL } from '../config';

const ALLOWED_EMAILS = ['kamil.dubiel@leocode.com'];

export const signupHandlers = [
  rest.post<SignupCreatorPayload, SignupCreatorResponse>(
    `${MOCK_API_URL}/creator/signup`,
    async (req, res, ctx) => {
      const { email } = await req.json();
      const delay = ctx.delay(1000);

      if (ALLOWED_EMAILS.includes(email)) {
        return res(delay, ctx.status(200));
      }

      return res(delay, ctx.status(400));
    },
  ),
];
