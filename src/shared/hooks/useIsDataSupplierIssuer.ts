import { useIssuerProfile } from '@/api/queries/useIssuerProfile';
import { DATA_SUPPLIER_ISSUER_NAMES } from '@/shared/config/dataSupplierIssuers';

export const useIsDataSupplierIssuer = (): boolean => {
  const { data } = useIssuerProfile();
  return (
    !!data?.companyName && DATA_SUPPLIER_ISSUER_NAMES.includes(data.companyName)
  );
};
