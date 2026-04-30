import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { UserRole } from '@/shared/typings/UserRole';
import { useGetUser } from '@/api/queries/useGetUser';
import {
  DomainVerificationContextType,
  DomainVerificationStep,
} from './DomainVerificationContext.types';

export const DomainVerificationContext =
  createContext<DomainVerificationContextType | null>(null);

type IssuerSignupContextProviderProps = {
  children: React.ReactNode;
  userRole: UserRole;
};

export const DomainVerificationContextProvider = ({
  children,
  userRole,
}: IssuerSignupContextProviderProps) => {
  const { data: user } = useGetUser();
  const [currentStep, setCurrentStep] = useState<DomainVerificationStep>(
    user?.domainPendingVerifcation ? 'verification' : 'domain',
  );

  const [currentTxtRecord, setCurrentTxtRecord] = useState<string>(
    user?.domainPendingVerifcation ? user.domainRecord : '',
  );
  const [domainAddress, setDomainAddress] = useState<string>(
    user?.domainPendingVerifcation ? user.domain : '',
  );

  // Resync local state when the user query resolves / changes. Adjusting
  // state during render (instead of in an effect) follows the React docs'
  // "syncing state with an external value" pattern and avoids the extra
  // commit + the `react-hooks/set-state-in-effect` violation.
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setCurrentStep(user?.domainPendingVerifcation ? 'verification' : 'domain');
    setCurrentTxtRecord(
      user?.domainPendingVerifcation ? user.domainRecord : '',
    );
    setDomainAddress(user?.domainPendingVerifcation ? user.domain : '');
  }

  const setTxtRecord = useCallback((txtRecord: string) => {
    setCurrentTxtRecord(txtRecord);
    setCurrentStep('text-record');
  }, []);

  const value = useMemo<DomainVerificationContextType>(
    () => ({
      currentStep,
      txtRecord: currentTxtRecord,
      domainAddress,
      userRole,
      setDomainAddress,
      setTxtRecord,
      setCurrentStep,
    }),
    [currentStep, currentTxtRecord, domainAddress, userRole, setTxtRecord],
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
