import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  DomainVerificationContextType,
  DomainVerificationStep,
} from './DomainVerificationContext.types';

export const DomainVerificationContext =
  createContext<DomainVerificationContextType | null>(null);

type IssuerSignupContextProviderProps = {
  children: React.ReactNode;
};

export const DomainVerificationContextProvider = ({
  children,
}: IssuerSignupContextProviderProps) => {
  const [currentStep, setCurrentStep] =
    useState<DomainVerificationStep>('domain');
  const [currentTxtRecord, setCurrentTxtRecord] = useState<string>('');

  const setTxtRecord = useCallback((txtRecord: string) => {
    setCurrentTxtRecord(txtRecord);
    setCurrentStep('text-record');
  }, []);

  const value = useMemo<DomainVerificationContextType>(
    () => ({
      currentStep,
      txtRecord: currentTxtRecord,
      setTxtRecord,
      setCurrentStep,
    }),
    [setTxtRecord, currentStep, currentTxtRecord],
  );

  return (
    <DomainVerificationContext.Provider value={value}>
      {children}
    </DomainVerificationContext.Provider>
  );
};

export const useDomainVerificationContext = () => {
  const context = useContext(DomainVerificationContext);

  if (!context) {
    throw new Error(
      'useDomainVerificationContext must be used within the DomainVerificationContextProvider',
    );
  }

  return context;
};
