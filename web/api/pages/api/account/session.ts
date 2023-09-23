import type { NextApiRequest, NextApiResponse } from 'next'
import { session_read_file } from '@/hooks/process/session_manager'
import type { Session as SessionInterface } from '@/lib/types/globals';
import type { Session, SessionResponse } from '@/lib/types/account/type';
import { http as constHttp } from '@/lib/constant/http'

/**
 * 現在ログイン中のセッション情報を返す.
 * 
 * @TODO
 * いまのところ画面なし.
 * セッション情報はnodeプロセス上で直で持つため確認の手段がないので念のため準備.
 * 用途的には管理者機能かバッチ処理.
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export default async function handler(
    _: NextApiRequest,
    res: NextApiResponse<SessionResponse>
) {

    const content: SessionInterface[] = session_read_file();

    const sessions: Session[] = content.map(( session: SessionInterface ): Session => {

        return {
            id: session.account_id,
            sessionId: session.id,
            address: session.address,
            registerName: session.registerName,
            displayName: session.displayName,
            class: session.class,
            loginDatetime: session.loginDatetime,
            videoConnectionDatetime: session.videoConnectionDatetime,
            expire_datetime: session.expire_datetime
        } as Session;
    })

    return res.status( constHttp.OK.code ).json({ sessions: sessions });
}