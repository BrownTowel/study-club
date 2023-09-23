import type { NextApiRequest, NextApiResponse } from 'next'
import type { AccountResponse, User, Account } from '@/lib/types/auth/type'
import { GlobalPermission, ScreenPermission } from '@/lib/types/globals';
import { decoded_json_web_token } from '@/hooks/process/token'
import { http as constHttp } from '@/lib/constant/http'
import jwt from 'jsonwebtoken';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    switch ( req.method ) {

        case "POST":

            return Post( req, res );

        case "OPTIONS":

            return res.status( constHttp.OK.code ).end();

        default:

            return res.status( constHttp.METHOD_NOT_ALLOWED.code ).send({
                message: `${ constHttp.METHOD_NOT_ALLOWED.message } Only POST requests allowed.`
            })
    }
}


/**
 * No. 2
 * API名: 認証アカウント情報取得
 * 通信方式: HTTP
 * HTTPメソッド: POST
 * エンドポイントURL: /auth/account
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse<AccountResponse>
 *
 * @returns void
 */
async function Post(
    req: NextApiRequest,
    res: NextApiResponse<AccountResponse>
) {

    const { token }: { token: string; } = req.body;

    let payload: jwt.JwtPayload;

    try {

        payload = decoded_json_web_token( token );

    } catch (e: any) {

        return res.status( constHttp.OK.code ).json({ account: null });
    }

    const user: User = {
        id: payload.id,
        address: payload.address,
        registerName: payload.registerName,
        displayName: payload.displayName,
        class: payload.class,
    }

    // const permissions = JSON.parse( globalThis.permission_info )[ user.class ];

    const permission_info: GlobalPermission | string = globalThis.PERMISSION_INFO;

    const permissions: ScreenPermission =
        typeof permission_info === "string" ?
            JSON.parse( permission_info )[ user.class ] :
            permission_info[ user.class ];


    const account: Account = {
        user: user,
        permissions: permissions
    }


    return res.status( constHttp.OK.code ).json({ account: account });
}
