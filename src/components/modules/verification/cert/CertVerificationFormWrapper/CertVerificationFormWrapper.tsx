import React from 'react';
import { useCertVerificationContext } from '../CertVerificationContext';
import { CertVerificationSubmitCertCard } from '../CertVerificationSubmitCertCard';
import { CertVerificationVerifyCard } from '../CertVerificationVerifyCard';
import { CertVerificationStatusCard } from '../CertVerificationStatusCard';

export const CertVerificationFormWrapper = () => {
  const { currentStep, externalCertPem, hasAcknowledgedCompletion } =
    useCertVerificationContext();

  // Three mutually-exclusive views in this order:
  //
  // 1. Already imported AND issuer clicked "Continue" → management view.
  //    On returning visits the context pre-acknowledges, so this is the
  //    branch we land on without the issuer ever seeing the success card.
  //
  // 2. Verification just succeeded but the issuer has not clicked
  //    Continue yet → keep the success card mounted, all by itself, until
  //    they explicitly leave it. This is the part that fixes the blink:
  //    no other card is allowed to render while the success card is up.
  //
  // 3. Anything else → the regular submit + verify form.
  if (externalCertPem && hasAcknowledgedCompletion) {
    return (
      <section className="flex flex-col gap-4">
        <CertVerificationStatusCard />
      </section>
    );
  }

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
