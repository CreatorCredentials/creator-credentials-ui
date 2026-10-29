import { ClerkRole } from '@/api/requests/getUser';

/** Item of GET admin/users. */
export type AdminUser = {
  id: number;
  role: ClerkRole;
  name: string | null;
  email: string | null;
  didKey: string;
  domain: string | null;
  didWeb: string | null;
  organizationName: string | null;
  createdAt: string;
  counts: {
    credentials: number;
    issuedCredentials: number;
  };
};
