import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestDataConfirmation } from '../CredentialsRequestDataConfirmation';
import { CredentialsRequestSelectCredentials } from '../CredentialsRequestSelectCredentials';
import { CredentialsRequestSelectIssuer } from '../CredentialsRequestSelectIssuer';
import { CredentialsRequestVerifyKeypair } from '../CredentialsRequestVerifyKeypair';

export const CredentialsRequestMultiStep = () => {
  const { activeStepKey } = useCredentialsRequestContext();

  return (
    <section className="flex flex-1 flex-col">
      {activeStepKey === 'select-credential' && (
        <CredentialsRequestSelectCredentials />
      )}
      {activeStepKey === 'select-issuer' && <CredentialsRequestSelectIssuer />}
      {activeStepKey === 'verify-keypair' && (
        <CredentialsRequestVerifyKeypair />
      )}
      {activeStepKey === 'confirm-data' && (
        <CredentialsRequestDataConfirmation />
      )}
    </section>
  );
};
