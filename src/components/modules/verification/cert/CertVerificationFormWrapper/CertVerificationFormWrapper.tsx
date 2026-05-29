import React from 'react';
import { useCertVerificationContext } from '../CertVerificationContext';
import { CertVerificationSubmitCertCard } from '../CertVerificationSubmitCertCard';
import { CertVerificationVerifyCard } from '../CertVerificationVerifyCard';
import { CertVerificationStatusCard } from '../CertVerificationStatusCard';

export const CertVerificationFormWrapper = () => {
  const { currentStep, externalCertPem } = useCertVerificationContext();

  // 1. Certificate is stored → always show the management view directly,
  //    whether this is a returning visit or the user just completed the flow.
  if (externalCertPem) {
    return (
      <section className="flex flex-col gap-4">
        <CertVerificationStatusCard />
      </section>
    );
  }

  // 2. Challenge just verified but the query refetch hasn't returned yet
  //    (externalCertPem still null) → show a brief success notice while
  //    we wait for the refetch to transition to the management view.
  if (currentStep === 'completed') {
    return (
      <section className="flex flex-col gap-4">
        <CertVerificationVerifyCard />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <CertVerificationSubmitCertCard />
      {currentStep === 'verify-signature' && <CertVerificationVerifyCard />}
    </section>
  );
};
