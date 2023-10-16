import type { ResponseResolver, RestRequest, RestContext } from 'msw';

export const mockGetHelloWorld: ResponseResolver<
  RestRequest,
  RestContext,
  string
> = (_req, res, ctx) => {
  return res(ctx.text('GET MSW!'));
};

export const mockPostHelloWorld: ResponseResolver<
  RestRequest,
  RestContext,
  string
> = (_req, res, ctx) => {
  return res(ctx.text('POST MSW!'));
};
