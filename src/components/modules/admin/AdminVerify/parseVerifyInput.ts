import { VerifyCredentialPayload } from '@/shared/typings/CredentialVerification';

export type VerifyInputError = 'empty' | 'invalid-json';

export type ParsedVerifyInput =
  { payload: VerifyCredentialPayload } | { error: VerifyInputError };

const isCredentialObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A pasted compact JWS becomes `{ jwt }`; anything that looks like JSON must parse to a credential object. */
export const parseVerifyInput = (raw: string): ParsedVerifyInput => {
  const text = raw.trim();
  if (!text) {
    return { error: 'empty' };
  }
  if (!text.startsWith('{')) {
    return { payload: { jwt: text } };
  }
  try {
    const credential: unknown = JSON.parse(text);
    return isCredentialObject(credential)
      ? { payload: { credential } }
      : { error: 'invalid-json' };
  } catch {
    return { error: 'invalid-json' };
  }
};
