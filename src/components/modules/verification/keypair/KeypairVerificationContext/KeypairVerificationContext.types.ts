export type KeypairVerificationStep =
  | 'generate'
  | 'submit-key'
  | 'verify-signature'
  | 'completed';

export type KeypairVerificationContextType = {
  currentStep: KeypairVerificationStep;
  commands: string[];
  challengeMessage: string | null;
  derivedDidKey: string | null;
  externalDidKey: string | null;
  activeDidKeySource: 'platform' | 'external';
  isLoading: boolean;
  setCurrentStep: (step: KeypairVerificationStep) => void;
  setCommands: (commands: string[]) => void;
  setChallengeMessage: (msg: string) => void;
  setDerivedDidKey: (key: string) => void;
};
