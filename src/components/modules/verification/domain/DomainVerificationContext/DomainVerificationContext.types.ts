export type DomainVerificationStep = 'domain' | 'text-record' | 'verification';

export type DomainVerificationContextType = {
  currentStep: DomainVerificationStep;
  txtRecord: string;
  setCurrentStep: (step: DomainVerificationStep) => void;
  setTxtRecord: (txtRecord: string) => void;
};
