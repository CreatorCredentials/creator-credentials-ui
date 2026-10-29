import { parseVerifyInput } from './parseVerifyInput';

describe('parseVerifyInput', () => {
  it('treats a non-JSON string as a compact JWT', () => {
    expect(parseVerifyInput('  eyJhbGciOi.eyJ2YyI6e30.c2ln \n')).toEqual({
      payload: { jwt: 'eyJhbGciOi.eyJ2YyI6e30.c2ln' },
    });
  });

  it('parses a JSON object as the credential', () => {
    expect(parseVerifyInput('{"proof":{"jwt":"abc"}}')).toEqual({
      payload: { credential: { proof: { jwt: 'abc' } } },
    });
  });

  it('rejects blank input', () => {
    expect(parseVerifyInput('   ')).toEqual({ error: 'empty' });
  });

  it('rejects malformed or non-object JSON', () => {
    expect(parseVerifyInput('{"proof":')).toEqual({ error: 'invalid-json' });
    expect(parseVerifyInput('[1,2]')).toEqual({ payload: { jwt: '[1,2]' } });
  });
});
