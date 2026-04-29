import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const isProtectedPath = (pathname: string) =>
  pathname.startsWith('/creator') || pathname.startsWith('/issuer');

export default function middleware(req: NextRequest) {
  // Let Clerk internal handshake requests pass through untouched.
  if (req.nextUrl.searchParams.has('_clerk_handshake')) {
    return NextResponse.next();
  }

  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Clerk session cookies used in production browser flows.
  const hasSession =
    Boolean(req.cookies.get('__session')?.value) ||
    Boolean(req.cookies.get('__clerk_db_jwt')?.value);

  if (!hasSession) {
    return NextResponse.redirect(new URL('/welcome', req.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
export const config = {
  matcher: [
    // Run middleware only where auth protection can apply.
    '/creator/:path*',
    '/issuer/:path*',
  ],
};
