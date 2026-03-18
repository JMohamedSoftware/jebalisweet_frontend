import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that require authentication
const protectedRoutes = [
    '/user-profile',
    '/orders',
    '/admin-dashboard',
    '/admin-product-management',
    '/admin-order-management',
    '/delivery-dashboard',
    '/checkout-payment'
];

// Define routes that only unauthenticated users should access (e.g., login, register)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token from cookies (synced during login)
    const token = request.cookies.get('auth_token')?.value;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        // Redirect unauthenticated users to the login page
        const loginUrl = new URL('/login', request.url);
        // Optionally save the requested URL to redirect back after login
        // loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        // Redirect authenticated users away from login/register pages
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    // Apply middleware to specific paths to optimize performance
    matcher: [
        '/user-profile/:path*',
        '/orders/:path*',
        '/admin-dashboard/:path*',
        '/admin-product-management/:path*',
        '/admin-order-management/:path*',
        '/delivery-dashboard/:path*',
        '/checkout-payment/:path*',
        '/login',
        '/register'
    ],
};
