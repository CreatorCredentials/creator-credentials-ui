export type DomainVerificationStep = 'domain' | 'text-record' | 'verification';

export type DomainVerificationContextType = {
  currentStep: DomainVerificationStep;
  txtRecord: string;
  domainAddress: string;
  setCurrentStep: (step: DomainVerificationStep) => void;
  setTxtRecord: (txtRecord: string) => void;
  setDomainAddress: (domainAddress: string) => void;
};
