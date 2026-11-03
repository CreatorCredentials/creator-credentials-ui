/** Every backend call goes through `/v1/`; Clerk's frontend API does too, so hosts are checked. */
export const API_URL_PATTERN = '**/v1/**';
const API_PATH_PATTERN = /\/v1\//;
const CLERK_HOST_PATTERN = /(^|\.)clerk\.(accounts\.dev|com)$|^clerk\./;

export const isClerkUrl = (url: URL): boolean =>
  CLERK_HOST_PATTERN.test(url.hostname);

/** A call to the application backend, as opposed to Clerk, Next.js or static assets. */
export const isBackendApiUrl = (url: URL): boolean =>
  API_PATH_PATTERN.test(url.pathname) && !isClerkUrl(url);
