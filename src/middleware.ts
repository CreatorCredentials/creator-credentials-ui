import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

import { config as configConstants } from '@/shared/constants/config';

const isProtectedRoute = createRouteMatcher([
  '/creator(.*)',
  '/issuer(.*)',
  '/creator/verification(.*)',
  '/creator/issuers(.*)',
  '/creator/credentials(.*)',
  '/creator/profile(.*)',
  '/issuer/verification(.*)',
  '/issuer/creators(.*)',
  '/issuer/credentials(.*)',
  '/issuer/profile(.*)',
  '/issuer/creators/requested(.*)',
  '/issuer/creators/accepted(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req))
    auth.protect({
      unauthorizedUrl: '/welcome',
      unauthenticatedUrl: configConstants.NEXTAUTH_URL + '/welcome',
    });
});

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
export const config = {
  matcher: [
    // Run middleware for all app routes (except Next internals / static files)
    '/((?!_next|.*\\..*).*)',
    '/',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
