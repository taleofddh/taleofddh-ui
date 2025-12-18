import { NextResponse } from 'next/server';
import {PROTECTED_ROUTES} from "./common/constants";

export const middleware = async (request) => {
    //console.log(request.cookies);
    const currentUser = request.cookies.get('credential')?.value

    const path = request.nextUrl.pathname;

    if(PROTECTED_ROUTES.includes(path)) {
        if (currentUser) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/sign-in' + '?redirect=' + path, request.url));
        }
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /* Match all request paths starting with:
        * - gallery
        * - gallery/:path
        * - my-account
        * - my-account/:path
        */
        '/gallery/:path',
        '/my-account/:path',
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - images (image files)
         * - videos (video files)
         * - fonts
         */
        '/((?!api|_next/static|_next/image|images|videos|fonts).*)',
        /*
         * Match all request paths except for the public ones starting with:
         * - All publicly available pages
         */
        '/((?!about-us|blogs|link|contact-us|sign-in|sign-up|reset-password|change-password|terms-and-conditions|privacy-policy|frequently-asked-questions).*)'
    ]
}