import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
// import GithubProvider from 'next-auth/providers/github'
import type { RequestInternal } from "next-auth/src/core"
import type { User, Awaitable } from "next-auth/src"
// import { useSession } from "next-auth/react";

// const AuthHandler = NextAuth({


export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    console.log("Begin auth api");

    const { nextauth } = req.query as { nextauth: string[] };


    console.log(nextauth);

    // const { data: session } = await useSession()

    // console.log(session);


    const options: NextAuthOptions = {
        // secret: process.env.NEXTAUTH_SECRET,
        providers: [
            // GithubProvider({
            //   clientId: process.env.GITHUB_CLIENT_ID ?? '',
            //   clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
            // }),
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    username: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" },
                },
                authorize(
                    credentials: Record<"username" | "password", string> | undefined,
                    request: Pick<RequestInternal, "body" | "query" | "headers" | "method">
                ) :User | null {

                    /** /api/auth/callback/credentials */

                    console.log("credentials");

                    console.log(credentials);
                    console.log(request);
                    
                    // credentials
                    // [Object: null prototype] {
                    //   csrfToken: 'f12bab7efffebc1b5451ebc4dabe7f1c9f9057ac2479b19a507db82aa2e179c6',
                    //   username: 'yuut',
                    //   password: 'aa'
                    // }
                    // {
                    //   query: {},
                    //   body: [Object: null prototype] {
                    //     csrfToken: 'f12bab7efffebc1b5451ebc4dabe7f1c9f9057ac2479b19a507db82aa2e179c6',
                    //     username: 'yuut',
                    //     password: 'aa'
                    //   },
                    //   headers: {
                    //     host: 'localhost:3000',
                    //     connection: 'keep-alive',
                    //     'content-length': '100',
                    //     'cache-control': 'max-age=0',
                    //     'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                    //     'sec-ch-ua-mobile': '?0',
                    //     'sec-ch-ua-platform': '"Windows"',
                    //     'upgrade-insecure-requests': '1',
                    //     origin: 'http://localhost:3000',
                    //     'content-type': 'application/x-www-form-urlencoded',
                    //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    //     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    //     'sec-fetch-site': 'same-origin',
                    //     'sec-fetch-mode': 'navigate',
                    //     'sec-fetch-user': '?1',
                    //     'sec-fetch-dest': 'document',
                    //     referer: 'http://localhost:3000/api/auth/signin',
                    //     'accept-encoding': 'gzip, deflate, br',
                    //     'accept-language': 'ja,en-US;q=0.9,en;q=0.8',
                    //     cookie: 'next-auth.csrf-token=f12bab7efffebc1b5451ebc4dabe7f1c9f9057ac2479b19a507db82aa2e179c6%7C1ba3da33ef95d8d717d128db35e80fc4c46bc22aeba83944541434ec15ea6d10; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000'
                    //   },
                    //   method: 'POST'
                    // }

                    return { id: "1", name: "admin" };
                }
                /*
                async authorize(
                    credentials: Record<"username" | "password", string> | undefined,
                    request: Pick<RequestInternal, "body" | "query" | "headers" | "method">
                ) :Awaitable<User | null> {

                    console.log("credentials");

                    let user = null;

                    try {

                        user = { id: 1, name: "admin" };
                    } catch (e) {

                        user = null;
                    }

                    return user;
                }
                */
            })
        ],
        session: {
            strategy: 'jwt',
            maxAge: 60 * 60 * 24
        },
        jwt: {
            maxAge: 60 * 3
        }
    };

    return await NextAuth( req, res, options );

    // return res.json({message: "ok"});
}

// export { AuthHandler as POST }
// export { handler as GET, handler as POST }
