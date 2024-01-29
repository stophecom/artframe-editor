import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('middleware');
  if (!isAuthenticated(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }

  return NextResponse.next();
}

// Step 2. Check HTTP Basic Auth header if present
function isAuthenticated(req: NextRequest) {
  const authorizationHeader = req.headers.get('authorization');
  return authorizationHeader === `Basic ${process.env.BASIC_AUTHORIZATION}`;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
