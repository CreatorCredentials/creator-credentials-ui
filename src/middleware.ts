import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/creator(.*)', '/issuer(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return;
  }

  try {
    await auth.protect({
      unauthenticatedUrl: '/welcome',
      unauthorizedUrl: '/welcome',
    });
  } catch {
    // `auth.protect()` can throw (e.g. unauthenticated requests or Clerk edge
    // handshake failures). Without this guard the exception bubbles up to a 500
    // error screen, so fall back to the welcome/login flow instead.
    return NextResponse.redirect(new URL('/welcome', req.url));
  }
});

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
export const config = {
  matcher: [
    // Run middleware only where auth protection can apply. Include the bare
    // paths so direct visits to `/creator` and `/issuer` are protected too.
    '/creator',
    '/creator/:path*',
    '/issuer',
    '/issuer/:path*',
  ],
};
