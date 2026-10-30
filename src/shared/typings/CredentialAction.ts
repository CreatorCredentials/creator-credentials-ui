import { ElementType } from 'react';
import { DropdownItemProps } from 'flowbite-react';

export type CredentialAction = DropdownItemProps<ElementType> & {
  'data-testid'?: string;
};
