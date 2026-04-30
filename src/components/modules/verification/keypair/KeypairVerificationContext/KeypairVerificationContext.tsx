import {
  createContext,
  useCallback,
  useContext,
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

  // Hydrate UI state from the persisted challenge whenever the status query
  // resolves. The keypair challenge is single-use per credential request, so
  // any "consumed" / no-challenge state should send the user back to the
  // beginning of the flow (i.e. they need to generate a new proof). We adjust
  // state during render (rather than in an effect) so React folds the update
  // into the current render pass — this is the pattern recommended by the
  // React docs for "syncing state with an external value".
  const [prevStatusData, setPrevStatusData] = useState(statusData);
  if (statusData !== prevStatusData) {
    setPrevStatusData(statusData);

    if (statusData) {
      const { challenge, commands: serverCommands } = statusData;

      if (!challenge) {
        setCurrentStep('generate');
      } else if (challenge.status === 'verified') {
        setCurrentStep('completed');
        if (challenge.derivedDidKey) {
          setDerivedDidKey(challenge.derivedDidKey);
        }
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
        // 'consumed' | 'failed' | unknown - treat as needing a fresh proof.
        setCurrentStep('generate');
      }

      if (serverCommands) {
        setCommands(serverCommands);
      }
    }
  }

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
