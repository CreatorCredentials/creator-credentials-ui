import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useKeypairChallengeStatus } from '@/api/queries/useKeypairChallengeStatus';
import { GetKeypairChallengeStatusResponse } from '@/api/requests/getKeypairChallengeStatus';
import {
  KeypairVerificationContextType,
  KeypairVerificationStep,
} from './KeypairVerificationContext.types';

const STEP_ORDER: Record<KeypairVerificationStep, number> = {
  generate: 0,
  'submit-key': 1,
  'verify-signature': 2,
  completed: 3,
};

const stepFromStatus = (
  statusData: GetKeypairChallengeStatusResponse,
): KeypairVerificationStep => {
  const { challenge } = statusData;

  if (!challenge) return 'generate';
  if (challenge.status === 'verified') return 'completed';
  if (challenge.status === 'challenge_issued') return 'verify-signature';
  if (challenge.status === 'initiated') return 'submit-key';
  return 'generate';
};

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
  const localStepRef = useRef<KeypairVerificationStep | null>(null);

  const setCurrentStepTracked = useCallback((step: KeypairVerificationStep) => {
    localStepRef.current = step;
    setCurrentStep(step);
  }, []);

  // Hydrate UI state from the persisted challenge whenever the status query
  // resolves. Ignore stale responses that would roll the UI back to an earlier
  // step while a local mutation (initiate / submit / verify) is in flight.
  useEffect(() => {
    if (!statusData) return;

    const serverStep = stepFromStatus(statusData);
    const localStep = localStepRef.current;

    if (localStep && STEP_ORDER[localStep] > STEP_ORDER[serverStep]) {
      return;
    }

    localStepRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStep(serverStep);

    const { challenge, commands: serverCommands } = statusData;

    if (challenge?.challengeMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChallengeMessage(challenge.challengeMessage);
    }
    if (challenge?.derivedDidKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDerivedDidKey(challenge.derivedDidKey);
    }
    if (serverCommands) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setCurrentStep: setCurrentStepTracked,
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
      setCurrentStepTracked,
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
