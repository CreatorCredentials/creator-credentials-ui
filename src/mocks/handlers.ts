import { rest } from 'msw';
import {
  mockGetHelloWorld,
  mockPostHelloWorld,
} from './resolvers/mockHelloWorld';
import { MOCK_API_URL } from './config';

export const handlers = [
  rest.get(`${MOCK_API_URL}/hello-world`, mockGetHelloWorld),
  rest.post(`${MOCK_API_URL}/hello-world`, mockPostHelloWorld),
];
