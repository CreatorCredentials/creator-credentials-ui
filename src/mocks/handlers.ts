import { authHandlers } from './domains/auth';
import { signupHandlers } from './domains/signup';

export const handlers = [...signupHandlers, ...authHandlers];
