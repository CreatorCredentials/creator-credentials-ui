import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

export default clerkMiddleware(async (auth, req) => {
  const welcomeUrl = new URL('/welcome', req.url).toString();

  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthorizedUrl: welcomeUrl,
      unauthenticatedUrl: welcomeUrl,
    });
  }
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
