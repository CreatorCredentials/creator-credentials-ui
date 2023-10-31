import { authHandlers } from './domains/auth';
import { verificationHandlers } from './domains/verification';

export const handlers = [...authHandlers, ...verificationHandlers];
