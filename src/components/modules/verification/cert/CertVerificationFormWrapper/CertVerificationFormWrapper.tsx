import React from 'react';
import { useCertVerificationContext } from '../CertVerificationContext';
import { CertVerificationStep } from '../CertVerificationContext/CertVerificationContext.types';
import { CertVerificationSubmitCertCard } from '../CertVerificationSubmitCertCard';
import { CertVerificationVerifyCard } from '../CertVerificationVerifyCard';
import { CertVerificationStatusCard } from '../CertVerificationStatusCard';

export const CertVerificationFormWrapper = () => {
  const { currentStep, externalCertPem } = useCertVerificationContext();

  return (
    <section className="flex flex-col gap-4">
      {externalCertPem ? (
        <CertVerificationStatusCard />
      ) : (
        <>
          <CertVerificationSubmitCertCard />
          {(
            ['verify-signature', 'completed'] as CertVerificationStep[]
          ).includes(currentStep) && <CertVerificationVerifyCard />}
        </>
      )}
    </section>
  );
};
