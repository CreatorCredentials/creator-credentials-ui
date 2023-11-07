import { authHandlers } from './domains/auth';
import { issuersHandlers } from './domains/issuers';
import { verificationHandlers } from './domains/verification';

export const handlers = [
  ...authHandlers,
  ...verificationHandlers,
  ...issuersHandlers,
];
