import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useKeypairChallengeStatus } from '@/api/queries/useKeypairChallengeStatus';
import {
  KeypairVerificationContextType,
  KeypairVerificationStep,
} from './KeypairVerificationContext.types';

export const KeypairVerificationContext =
  createContext<KeypairVerificationContextType | null>(null);

type KeypairVerificationContextProviderProps = {
  children: React.ReactNode;
};

export const KeypairVerificationContextProvider = ({
  children,
}: KeypairVerificationContextProviderProps) => {
  const { data: statusData, isLoading } = useKeypairChallengeStatus();

  const [currentStep, setCurrentStep] =
    useState<KeypairVerificationStep>('generate');
  const [commands, setCommands] = useState<string[]>([]);
  const [challengeMessage, setChallengeMessage] = useState<string | null>(null);
  const [derivedDidKey, setDerivedDidKey] = useState<string | null>(null);

  useEffect(() => {
    if (!statusData) return;

    const { challenge, commands: serverCommands, externalDidKey } = statusData;

    if (externalDidKey) {
      setCurrentStep('completed');
      return;
    }

    if (!challenge) {
      setCurrentStep('generate');
      return;
    }

    if (challenge.status === 'verified') {
      setCurrentStep('completed');
    } else if (challenge.status === 'challenge_issued') {
      setCurrentStep('verify-signature');
      if (challenge.challengeMessage) {
        setChallengeMessage(challenge.challengeMessage);
      }
      if (challenge.derivedDidKey) {
        setDerivedDidKey(challenge.derivedDidKey);
      }
    } else if (challenge.status === 'initiated') {
      setCurrentStep('submit-key');
    } else {
      setCurrentStep('generate');
    }

    if (serverCommands) {
      setCommands(serverCommands);
    }
  }, [statusData]);

  const handleSetCommands = useCallback((cmds: string[]) => {
    setCommands(cmds);
  }, []);

  const handleSetChallengeMessage = useCallback((msg: string) => {
    setChallengeMessage(msg);
  }, []);

  const handleSetDerivedDidKey = useCallback((key: string) => {
    setDerivedDidKey(key);
  }, []);

  const value = useMemo<KeypairVerificationContextType>(
    () => ({
      currentStep,
      commands,
      challengeMessage,
      derivedDidKey,
      externalDidKey: statusData?.externalDidKey ?? null,
      activeDidKeySource: statusData?.activeDidKeySource ?? 'platform',
      isLoading,
      setCurrentStep,
      setCommands: handleSetCommands,
      setChallengeMessage: handleSetChallengeMessage,
      setDerivedDidKey: handleSetDerivedDidKey,
    }),
    [
      currentStep,
      commands,
      challengeMessage,
      derivedDidKey,
      statusData,
      isLoading,
      handleSetCommands,
      handleSetChallengeMessage,
      handleSetDerivedDidKey,
    ],
  );

  return (
    <KeypairVerificationContext.Provider value={value}>
      {children}
    </KeypairVerificationContext.Provider>
  );
};

export const useKeypairVerificationContext = () => {
  const context = useContext(KeypairVerificationContext);

  if (!context) {
    throw new Error(
      'useKeypairVerificationContext must be used within the KeypairVerificationContextProvider',
    );
  }

  return context;
};
