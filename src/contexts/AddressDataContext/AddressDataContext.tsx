import { createContext, useContext, useState } from 'react';

export type AddressData = {
  address: string | null;
};

type AddressDataContextProps = {
  data: AddressData;
  updateData: (newData: AddressData) => void;
};

const initialData = { address: null };
export const AddressContext = createContext<AddressDataContextProps>({
  data: initialData,
  updateData: () => {},
});

export const AddressDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addressData, setAddressData] = useState<AddressData>(initialData);

  const updateData = (newData: AddressData) => {
    setAddressData(newData);
  };

  return (
    <AddressContext.Provider value={{ data: addressData, updateData }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressData = () => useContext(AddressContext);
