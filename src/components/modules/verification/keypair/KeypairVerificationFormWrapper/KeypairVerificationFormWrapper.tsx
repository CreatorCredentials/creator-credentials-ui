import React from 'react';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { KeypairVerificationStep } from '../KeypairVerificationContext/KeypairVerificationContext.types';
import { KeypairVerificationGenerateCard } from '../KeypairVerificationGenerateCard';
import { KeypairVerificationSubmitKeyCard } from '../KeypairVerificationSubmitKeyCard';
import { KeypairVerificationVerifyCard } from '../KeypairVerificationVerifyCard';
import { KeypairVerificationStatusCard } from '../KeypairVerificationStatusCard';

export const KeypairVerificationFormWrapper = () => {
  const { currentStep, externalDidKey } = useKeypairVerificationContext();

  return (
    <section className="flex flex-col gap-4">
      {externalDidKey ? (
        <KeypairVerificationStatusCard />
      ) : (
        <>
          <KeypairVerificationGenerateCard />
          {(
            [
              'submit-key',
              'verify-signature',
              'completed',
            ] as KeypairVerificationStep[]
          ).includes(currentStep) && <KeypairVerificationSubmitKeyCard />}
          {(
            ['verify-signature', 'completed'] as KeypairVerificationStep[]
          ).includes(currentStep) && <KeypairVerificationVerifyCard />}
        </>
      )}
    </section>
  );
};
