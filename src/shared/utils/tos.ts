/**
 * Stores the accepted ToS URL in a short-lived cookie so that withAuth (SSR)
 * can write it to Clerk publicMetadata on the first authenticated page load.
 */
export const setPendingTosLinkCookie = (tosUrl: string): void => {
  document.cookie = `pendingTosLink=${encodeURIComponent(tosUrl)}; Path=/; Max-Age=3600; SameSite=Lax`;
};
