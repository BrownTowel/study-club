import type { NextApiRequest, NextApiResponse } from 'next'
import type { CredentialResponse, JWTPayload } from '@/lib/types/auth/type'
import type { Account as AccountInterface, GlobalPermission, ScreenPermission } from '@/lib/types/globals';
import { client } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { http as constHttp } from '@/lib/constant/http'
import { get_current_datetime_string } from '@/lib/utility/date_format';
import { session_manager, session_clear, session_write_file } from '@/hooks/process/session_manager'
import { json_web_token } from '@/hooks/process/token'
import { setTimeout } from 'timers/promises';
import { nanoid } from 'nanoid';

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

            return res.status( constHttp.METHOD_NOT_ALLOWED.code ).send( {
                message: `${ constHttp.METHOD_NOT_ALLOWED.message } Only POST requests allowed.`
            } );
    }
}

/**
 * No. 1
 * API名: アカウント認証
 * 通信方式: HTTP
 * HTTPメソッド: POST
 * エンドポイントURL: /auth/credential
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse<CredentialResponse>
 *
 * @returns void
 */
async function Post(
    req: NextApiRequest,
    res: NextApiResponse<CredentialResponse>
) {

    const { address, password }: { address: string; password: string | undefined; } = req.body;


    if ( ! address || address === '' ) {
        /** パラメーターエラー ※バリデーションにあとで移動 */
        return res.status(constHttp.BAD_REQUEST.code).json({ credential: undefined, error: { message: constHttp.BAD_REQUEST.message } });
    }

    const find_query_option: Prisma.AccountFindUniqueArgs = { where: { address: address } };

    if ( password ) {

        find_query_option.where.password = password;
    }


    let record: any = await client.account.findUnique( find_query_option );

    if ( ! record ) {
        /** 認証不可ルート */
        return res.status( constHttp.OK.code ).json({ credential: null });
    }


    const update_query_option: Prisma.AccountUpdateArgs = {
        where: { id: record.id },
        data: { loginDatetime: get_current_datetime_string() }
    };

    /**
     * 明確な割り当てアサーション
     * https://typescriptbook.jp/reference/values-types-variables/definite-assignment-assertion
     */
    let account!: AccountInterface;

    const token: string = await client.$transaction( async client => {

        record = await client.account.update( update_query_option );

        session_clear( record.id, globalThis.SESSION );

        const sessionId: string = nanoid();

        account = {
            id: record?.id,
            address: record?.address,
            registerName: record?.registerName,
            displayName: record?.displayName,
            class: record?.class,
            loginDatetime: record?.loginDatetime,
            videoConnectionDatetime: record?.videoConnectionDatetime
        };

        const payload: JWTPayload = { ...account,  ...{ sessionId: sessionId } };

        const token: string = json_web_token( payload );


        globalThis.SESSION.push( session_manager( sessionId, token, account ) );
  
        /** session output file */
        let count: number = parseInt( process.env.RETRY_THRESHOLD_COUNT ?? '0', 10 );
        const interval: number = parseInt( process.env.RETRY_INTERVAL ?? '0', 10 );
        
        while ( count ) {

            if ( globalThis.SESSION_FILE_LOCK ) {

                --count;

                await setTimeout(interval);

                continue;
            }


            globalThis.SESSION_FILE_LOCK = true;

            const ret = session_write_file( globalThis.SESSION );

            if ( ! ret ) {

                globalThis.SESSION_FILE_LOCK = false;

                --count;

                continue;
            }

            globalThis.SESSION_FILE_LOCK = false;

            break;
        }


        return token;
    });


    const permission_info: GlobalPermission | string = globalThis.PERMISSION_INFO;

    const permissions: ScreenPermission =
        typeof permission_info === "string" ?
            JSON.parse( permission_info )[ account.class ] :
            permission_info[ account.class ];


    return res.status(constHttp.OK.code)
        .json({
            credential: {
                account: account,
                token: token,
                permissions: permissions
            }
        });
}
