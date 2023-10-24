import { SignupIssuerPayload } from '@/api/requests/signupIssuer';
import { IssuerSignupContextFormSteps } from './IssuerSignupContext/IssuerSignupContext.types';

export const mapIssuerSignupContextFormStepsToPayload = (
  steps: IssuerSignupContextFormSteps,
): SignupIssuerPayload => {
  const {
    details: { domain, companyName },
    email: { address, termsAndConditions },
  } = steps;

  return {
    domain,
    companyName,
    email: address,
    termsAndConditions,
  };
};
