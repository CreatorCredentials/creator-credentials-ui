export enum UserRole {
  Creator = 'CREATOR',
  Issuer = 'ISSUER',
  Admin = 'ADMIN',
}

/** Landing page of a signed-in user with the given role. */
export const HOME_PATH_BY_ROLE: Record<UserRole, string> = {
  [UserRole.Creator]: '/creator',
  [UserRole.Issuer]: '/issuer',
  [UserRole.Admin]: '/admin/credentials',
};
