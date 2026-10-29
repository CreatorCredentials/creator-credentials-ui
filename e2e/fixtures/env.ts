import { existsSync } from 'node:fs';
import path from 'node:path';

export type Role = 'issuer' | 'creator' | 'admin';

export const ROLES: Role[] = ['issuer', 'creator', 'admin'];

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LOCAL_ENV_FILE = path.join(REPO_ROOT, '.env.local');
const AUTH_STATE_DIR = path.join(REPO_ROOT, 'e2e', '.auth');
const DEFAULT_APP_PORT = 3000;
const REAL_API_MODE = 'real';

let localEnvLoaded = false;

/** Loads `.env.local` once; variables already present in the environment win. */
export const loadLocalEnv = (): void => {
  if (localEnvLoaded) {
    return;
  }
  localEnvLoaded = true;
  if (existsSync(LOCAL_ENV_FILE)) {
    process.loadEnvFile(LOCAL_ENV_FILE);
  }
};

export const appPort = (): number =>
  Number(process.env.FRONTEND_APP_PORT) || DEFAULT_APP_PORT;

export const appBaseUrl = (): string => `http://localhost:${appPort()}`;

export const isRealApi = (): boolean => process.env.E2E_API === REAL_API_MODE;

export type RoleCredentials = {
  identifier: string;
  password: string;
};

const credentialVariable = (role: Role, suffix: 'EMAIL' | 'PASSWORD') =>
  `E2E_${role.toUpperCase()}_${suffix}`;

export const credentialsFor = (role: Role): RoleCredentials | null => {
  const identifier = process.env[credentialVariable(role, 'EMAIL')];
  const password = process.env[credentialVariable(role, 'PASSWORD')];
  return identifier && password ? { identifier, password } : null;
};

export const hasAuth = (role: Role): boolean => credentialsFor(role) !== null;

export const missingAuthMessage = (role: Role): string =>
  `${credentialVariable(role, 'EMAIL')} / ${credentialVariable(role, 'PASSWORD')} not set`;

export const authStateDir = (): string => AUTH_STATE_DIR;

export const authStatePath = (role: Role): string =>
  path.join(AUTH_STATE_DIR, `${role}.json`);
