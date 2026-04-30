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
  /**
   * True once the issuer has explicitly clicked the Continue button on the
   * post-verification success card. Until that happens, the form wrapper
   * keeps the success card mounted and refuses to swap in the management
   * view. This is what prevents the previous "blink" caused by the wrapper
   * hot-swapping between two green-success components as soon as the
   * status query refetched the imported cert.
   */
  hasAcknowledgedCompletion: boolean;
  setCurrentStep: (step: CertVerificationStep) => void;
  setCommands: (commands: string[]) => void;
  acknowledgeCompletion: () => void;
};
