import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  useEffect(() => {
    if (!statusData) return;

    const { challenge, commands: serverCommands, externalCertPem } = statusData;

    if (externalCertPem) {
      setCurrentStep('completed');
      return;
    }

    if (!challenge) {
      setCurrentStep('submit-cert');
      return;
    }

    if (challenge.status === 'verified' && externalCertPem) {
      setCurrentStep('completed');
    } else if (challenge.status === 'verified' && !externalCertPem) {
      setCurrentStep('submit-cert');
    } else if (challenge.status === 'challenge_issued') {
      setCurrentStep('verify-signature');
    } else {
      setCurrentStep('submit-cert');
    }

    if (serverCommands) {
      setCommands(serverCommands);
    }
  }, [statusData]);

  const handleSetCommands = useCallback((cmds: string[]) => {
    setCommands(cmds);
  }, []);

  const value = useMemo<CertVerificationContextType>(
    () => ({
      currentStep,
      commands,
      externalCertPem: statusData?.externalCertPem ?? null,
      activeSigningCertSource:
        statusData?.activeSigningCertSource ?? 'platform',
      isLoading,
      setCurrentStep,
      setCommands: handleSetCommands,
    }),
    [currentStep, commands, statusData, isLoading, handleSetCommands],
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
