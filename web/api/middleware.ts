// import { NextResponse } from 'next/server'
import type { NextRequest  } from 'next/server'
// import type { NextRequest, NextResponse  } from 'next/server'
import { http as constHttp } from '@/lib/constant/http'
// import { decoded_json_web_token } from './hooks/process/token';

/**
 *   /((?!api|_next/static|_next/image|favicon.ico).*)
 */
export const config = {
    matcher: [
        "/((?!api/auth/credential|api/auth/account).*)",
    ],
};

export function middleware(req: NextRequest) {

    console.log(`** Middleware **`);

    // if ( req.method !== "OPTIONS" ) {

    //     const authorization: string = req.headers.get("authorization") ?? "";

    //     const [ bearer, _ ]: string[] = authorization.split(" ");

    //     if ( bearer !== "Bearer" ) {

    //         return new Response(
    //             constHttp.UNAUTHORIZED.message,
    //             {
    //                 status: constHttp.UNAUTHORIZED.code,
    //                 headers: {
    //                     'WWW-Authenticate': 'Basic realm="Secure Area"'
    //                 }
    //         });
    //     }

    // }
    // const ret = decoded_json_web_token( jwt );


    // return NextResponse.redirect(new URL('/about-2', request.url))
}
