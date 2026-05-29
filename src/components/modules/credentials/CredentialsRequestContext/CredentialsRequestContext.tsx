import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useStepper } from '@/shared/hooks/useStepper';
import { IssuerWithVerifiedCredentials } from '@/shared/typings/Issuer';
import { useSelect } from '@/shared/hooks/useSelect';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';
import { KEYPAIR_REQUIRED_TEMPLATE_TYPES } from '@/shared/typings/CredentialTemplateType';
import {
  CREDENTIALS_REQUEST_BASE_STEP_KEYS,
  CREDENTIALS_REQUEST_KEYPAIR_STEP_KEYS,
  CredentialsRequestStepKey,
} from '../CredentialsRequestStepper';
import { CredentialsRequestContextType } from './CredentialsRequestContext.types';

export const CredentialsRequestContext =
  createContext<CredentialsRequestContextType | null>(null);

type CredentialsRequestContextProviderProps = {
  children: React.ReactNode;
  preSelectedIssuerId: string | null;
};

export const CredentialsRequestContextProvider = ({
  children,
  preSelectedIssuerId,
}: CredentialsRequestContextProviderProps) => {
  // The stepper is initialised with the longest possible step list so the
  // hook accepts any forward navigation. The visible step keys are computed
  // separately (below) based on which credential template is selected.
  const stepper = useStepper({
    steps: CREDENTIALS_REQUEST_KEYPAIR_STEP_KEYS,
  });
  const [selectedIssuer, setSelectedIssuer] =
    useState<IssuerWithVerifiedCredentials | null>(null);
  const templates = useSelect<Omit<VerifiedCredentialsTemplate, 'id'>>({
    singleSelection: true,
  });

  const toggleIssuerSelection = useCallback(
    (issuer: IssuerWithVerifiedCredentials) => {
      if (selectedIssuer?.id === issuer.id) {
        setSelectedIssuer(null);
      } else {
        setSelectedIssuer(issuer);
      }
    },
    [selectedIssuer?.id],
  );

  const needsKeypairChallenge = useMemo(
    () =>
      templates.selectedItems.some((tmpl) =>
        KEYPAIR_REQUIRED_TEMPLATE_TYPES.includes(tmpl.templateType),
      ),
    [templates.selectedItems],
  );

  const stepKeys = useMemo<CredentialsRequestStepKey[]>(
    () =>
      needsKeypairChallenge
        ? CREDENTIALS_REQUEST_KEYPAIR_STEP_KEYS
        : CREDENTIALS_REQUEST_BASE_STEP_KEYS,
    [needsKeypairChallenge],
  );

  // If the user toggles the keypair-required template after navigating past
  // step 2, clamp the stepper so the active index always lands on a valid
  // visible step. Using a ref avoids re-running this when stepKeys length
  // is unchanged across renders.
  const lastStepCountRef = useRef(stepKeys.length);
  const { activeStep, setActiveStep } = stepper;
  useEffect(() => {
    if (stepKeys.length === lastStepCountRef.current) return;
    lastStepCountRef.current = stepKeys.length;
    if (activeStep > stepKeys.length - 1) {
      setActiveStep(stepKeys.length - 1);
    }
  }, [stepKeys.length, activeStep, setActiveStep]);

  const activeStepKey = stepKeys[Math.min(activeStep, stepKeys.length - 1)];

  const value = useMemo<CredentialsRequestContextType>(
    () => ({
      stepper,
      templates,
      preSelectedIssuerId,
      selectedIssuer,
      toggleIssuerSelection,
      stepKeys,
      activeStepKey,
      needsKeypairChallenge,
    }),
    [
      stepper,
      templates,
      preSelectedIssuerId,
      selectedIssuer,
      toggleIssuerSelection,
      stepKeys,
      activeStepKey,
      needsKeypairChallenge,
    ],
  );

  return (
    <CredentialsRequestContext.Provider value={value}>
      {children}
    </CredentialsRequestContext.Provider>
  );
};

export const useCredentialsRequestContext = () => {
  const context = useContext(CredentialsRequestContext);

  if (!context) {
    throw new Error(
      'useCredentialsRequestContext must be used within the CredentialsRequestContextProvider',
    );
  }

  return context;
};
