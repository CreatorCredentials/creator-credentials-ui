import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import {
  platformStatusListUrl,
  revocationListAction,
  statusListUrlOf,
} from './credentialActions';

const LIST_URL = 'https://api.example.org/v1/status-lists/1';

const withStatus = (credentialObject: object) =>
  ({ data: { credentialObject } }) as unknown as Pick<
    VerifiedCredentialsUnion,
    'data'
  >;

describe('statusListUrlOf', () => {
  it('reads the status list the credential is registered in', () => {
    expect(
      statusListUrlOf(
        withStatus({
          credentialStatus: {
            statusListCredential: LIST_URL,
            statusListIndex: '7',
          },
        }),
      ),
    ).toBe(LIST_URL);
  });

  it('is undefined for a credential without a status entry', () => {
    expect(statusListUrlOf(withStatus({}))).toBeUndefined();
    expect(
      statusListUrlOf({ data: {} } as Pick<VerifiedCredentialsUnion, 'data'>),
    ).toBeUndefined();
  });
});

describe('revocationListAction', () => {
  it('offers the entry only when there is a list to open', () => {
    expect(revocationListAction(withStatus({}), 'Revocation list')).toEqual([]);
    const [action] = revocationListAction(
      withStatus({ credentialStatus: { statusListCredential: LIST_URL } }),
      'Revocation list',
    );
    expect(action.children).toBe('Revocation list');
  });
});

describe('platformStatusListUrl', () => {
  it('points at the backend status list without a double slash', () => {
    process.env.NEST_API_URL = 'https://api.example.org/';
    expect(platformStatusListUrl()).toBe(LIST_URL);
  });
});
