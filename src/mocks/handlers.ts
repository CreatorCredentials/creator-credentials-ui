import { authHandlers } from './domains/auth';
import { creatorsHandlers } from './domains/creators';
import { credentialsHandlers } from './domains/credentials';
import { issuersHandlers } from './domains/issuers';
import { verificationHandlers } from './domains/verification';

export const handlers = [
  ...authHandlers,
  ...verificationHandlers,
  ...issuersHandlers,
  ...credentialsHandlers,
  ...creatorsHandlers,
];
