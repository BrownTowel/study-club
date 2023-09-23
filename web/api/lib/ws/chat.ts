import { Server as WebSocketServer } from "socket.io";
import { WEB_SOCKET } from '@/lib/constant/const';
import { decoded_json_web_token } from '@/hooks/process/token';
import { JwtPayload } from 'jsonwebtoken';
import { Account, Chat, Prisma } from "@prisma/client";
import { client } from "@/prisma/client";
import { http as constHttp } from '@/lib/constant/http'

export const chat = (wss: WebSocketServer, socket: any) => {

    const [ _, token ]: string[] = socket.handshake.headers.authorization.split(" ");

    const payload: JwtPayload = decoded_json_web_token( token );
    /**
     * No. 4
     * API名: チャットコンテンツ取得
     * 通信方式: websocket
     * 
     * @param message any
     *
     * @returns void
     */
    const fetch = async ( message: any ) => {

        console.log(`************************`);
        console.log(socket.id);

        const cursor = message.cursor;
        const take = 10;

        console.log(`cursor: ${ cursor }`)

        const records = await client.chat.findMany({
            where: { deletedDatetime: null },
            skip: cursor,
            take: take,
            orderBy: { sequenceNumber: 'desc' }
        });

        wss.to(socket.id).emit( WEB_SOCKET.RECEIVER.CHAT.FETCH, records.reverse() );
    }
    /**
     * No. 5
     * API名: チャットコンテンツ登録
     * 通信方式: websocket
     * 
     * @param message any
     *
     * @returns void
     */
    const post = async ( message: any ) => {

        // console.log(`received`);
        // console.log(payload);
        // console.log(message);

        const account_id: number = payload.id;


        const query: Prisma.Sql = Prisma.sql`
            INSERT INTO chat (
                content,
                sequence_number,
                create_account_id,
                update_account_id
            ) VALUES (
                ${ message.content },
                (
                    select
                        ifnull(max(t1.sequence_number), 0) + 1
                    from
                        chat as t1
                ),
                ${ account_id },
                ${ account_id }
            )
        `;

        const chat = await client.$transaction( async client => {

            try {
                await client.$queryRaw( query );

                // const record = await client.chat.findFirst({
                //     where: { createAccountId: account_id },
                //     orderBy: { createTimestamp: 'desc' }
                // });

                // throw new Error;
                // if ( ! record ) {

                //     throw new Error;
                // }

                // const accounts: Array<Account> = await client.account.findMany();

                // const data: Prisma.ChatReadingInfoCreateManyInput[] = accounts.map(account => ({
                //     accountId: account.id,
                //     sequenceNumber: record.sequenceNumber,
                //     createAccountId: account.id,
                //     updateAccountId: account.id
                // }));

                // await client.chatReadingInfo.createMany({ data: data })


                return await client.chat.findFirstOrThrow({
                    where: { createAccountId: account_id },
                    orderBy: { createTimestamp: 'desc' }
                });

            } catch (e: unknown) {

                console.error(`chat post exception: ${ e instanceof Error ? e.message : 'unknown error' }`);

                return;
            }
        });


        const data = {
            status: chat ? constHttp.OK.code : constHttp.INTERNAL_SERVER_ERROR.code,
            message: chat ? `` : constHttp.INTERNAL_SERVER_ERROR.message,
            data: chat
        }

        wss.emit( WEB_SOCKET.RECEIVER.CHAT.POST, data );
    };


    // return { post };
    socket.on( WEB_SOCKET.RECEIVER.CHAT.FETCH, fetch );
    socket.on( WEB_SOCKET.RECEIVER.CHAT.POST, post );
}
