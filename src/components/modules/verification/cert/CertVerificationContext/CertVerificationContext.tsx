import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useCertChallengeStatus } from '@/api/queries/useCertChallengeStatus';
import {
  CertVerificationContextType,
  CertVerificationStep,
} from './CertVerificationContext.types';

export const CertVerificationContext =
  createContext<CertVerificationContextType | null>(null);

type CertVerificationContextProviderProps = {
  children: React.ReactNode;
};

export const CertVerificationContextProvider = ({
  children,
}: CertVerificationContextProviderProps) => {
  const { data: statusData, isLoading } = useCertChallengeStatus();

  const [currentStep, setCurrentStep] =
    useState<CertVerificationStep>('submit-cert');
  const [commands, setCommands] = useState<string[]>([]);
  const [hasAcknowledgedCompletion, setHasAcknowledgedCompletion] =
    useState(false);

  // Hydrate UI state from the persisted challenge whenever the status query
  // resolves. We adjust state during render (rather than in an effect) so
  // React folds the update into the current render pass — this is the pattern
  // recommended by the React docs for "syncing state with an external value".
  const [prevStatusData, setPrevStatusData] = useState(statusData);
  if (statusData !== prevStatusData) {
    setPrevStatusData(statusData);

    if (statusData) {
      const {
        challenge,
        commands: serverCommands,
        externalCertPem,
      } = statusData;

      if (externalCertPem) {
        setCurrentStep('completed');
        if (serverCommands) setCommands(serverCommands);
      } else if (!challenge) {
        setCurrentStep('submit-cert');
      } else {
        if (challenge.status === 'verified') {
          setCurrentStep('completed');
        } else if (challenge.status === 'challenge_issued') {
          setCurrentStep('verify-signature');
        } else {
          setCurrentStep('submit-cert');
        }

        if (serverCommands) {
          setCommands(serverCommands);
        }
      }
    }
  }

  const handleSetCommands = useCallback((cmds: string[]) => {
    setCommands(cmds);
  }, []);

  const acknowledgeCompletion = useCallback(() => {
    setHasAcknowledgedCompletion(true);
  }, []);

  const value = useMemo<CertVerificationContextType>(
    () => ({
      currentStep,
      commands,
      externalCertPem: statusData?.externalCertPem ?? null,
      activeSigningCertSource:
        statusData?.activeSigningCertSource ?? 'platform',
      isLoading,
      hasAcknowledgedCompletion,
      setCurrentStep,
      setCommands: handleSetCommands,
      acknowledgeCompletion,
    }),
    [
      currentStep,
      commands,
      statusData,
      isLoading,
      hasAcknowledgedCompletion,
      handleSetCommands,
      acknowledgeCompletion,
    ],
  );

  return (
    <CertVerificationContext.Provider value={value}>
      {children}
    </CertVerificationContext.Provider>
  );
};

export const useCertVerificationContext = () => {
  const context = useContext(CertVerificationContext);

  if (!context) {
    throw new Error(
      'useCertVerificationContext must be used within the CertVerificationContextProvider',
    );
  }

  return context;
};
