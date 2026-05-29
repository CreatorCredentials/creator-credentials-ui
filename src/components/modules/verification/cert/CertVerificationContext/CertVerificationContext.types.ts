export type CertVerificationStep =
  | 'submit-cert'
  | 'verify-signature'
  | 'completed';

export type CertVerificationContextType = {
  currentStep: CertVerificationStep;
  commands: string[];
  externalCertPem: string | null;
  activeSigningCertSource: 'platform' | 'external';
  isLoading: boolean;
  setCurrentStep: (step: CertVerificationStep) => void;
  setCommands: (commands: string[]) => void;
};
