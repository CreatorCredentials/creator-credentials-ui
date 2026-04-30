import React from 'react';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { KeypairVerificationStep } from '../KeypairVerificationContext/KeypairVerificationContext.types';
import { KeypairVerificationGenerateCard } from '../KeypairVerificationGenerateCard';
import { KeypairVerificationSubmitKeyCard } from '../KeypairVerificationSubmitKeyCard';
import { KeypairVerificationVerifyCard } from '../KeypairVerificationVerifyCard';

const STEPS_AFTER_GENERATE: KeypairVerificationStep[] = [
  'submit-key',
  'verify-signature',
  'completed',
];
const STEPS_AFTER_SUBMIT: KeypairVerificationStep[] = [
  'verify-signature',
  'completed',
];

export const KeypairVerificationFormWrapper = () => {
  const { currentStep } = useKeypairVerificationContext();

  return (
    <section className="flex flex-col gap-4">
      <KeypairVerificationGenerateCard />
      {STEPS_AFTER_GENERATE.includes(currentStep) && (
        <KeypairVerificationSubmitKeyCard />
      )}
      {STEPS_AFTER_SUBMIT.includes(currentStep) && (
        <KeypairVerificationVerifyCard />
      )}
    </section>
  );
};
