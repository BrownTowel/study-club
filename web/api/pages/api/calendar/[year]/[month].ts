import type { NextApiRequest, NextApiResponse } from 'next'
import type { CalendarResponse, ResultCalendar } from '@/lib/types/calendar/type'
import { Prisma } from "@prisma/client";
import { client } from "@/prisma/client";
import { get_current_datetime_display } from '@/lib/utility/date_format';
import { http as constHttp } from '@/lib/constant/http'
import { verification } from '@/hooks/auth/token';
import { ApiNo } from "@/lib/constant/api_permission"
import type { Verification } from '@/lib/types/auth/type';

/**
 * @var account_id アカウント.ID
 * アカウント認証成功時にトークン情報から取得.
 */
let account_id : number;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if ( req.method === "OPTIONS" ) {

        return res.status( constHttp.OK.code ).end();
    }

    let act: Function;
    let api_no: ApiNo;

    switch ( req.method ) {

        case "GET":

            act = Get;
            api_no = ApiNo.GET_CALENDAR;

            break;

        case "POST":

            act = Post;
            api_no = ApiNo.POST_CALENDAR;

            break;

        default:

            return res.status( constHttp.METHOD_NOT_ALLOWED.code ).send({
                message: `${ constHttp.METHOD_NOT_ALLOWED.message } Only GET Or POST requests allowed.`
            })
    }

    const [ is_verification, is_expire, _account_id ]: Verification = verification( req, api_no );

    if ( ! is_expire ) {

        return res.status( constHttp.EXPIRED_TOKEN.code ).send( {
            message: `${ constHttp.EXPIRED_TOKEN.message }`
        } );            
    }

    if ( ! is_verification ) {

        res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');

        return res.status( constHttp.UNAUTHORIZED.code ).send( {
            message: `${ constHttp.UNAUTHORIZED.message }`
        } );
    }

    account_id = _account_id as number;

    return act( req, res );
}

/*
** Base SQL ************

SELECT
    calendar.id AS calendar_id,
    calendar.title AS calendar_title,
    calendar.status AS calendar_status,
    calendar.answer_format_class AS answer_format_class,
    calendar.create_account_id AS calendar_create_account_id,
    calendar.create_timestamp AS calendar_create_timestamp,
    calendar.update_account_id AS calendar_update_account_id,
    calendar.update_timestamp AS calendar_update_timestamp,
    CONCAT(
        '[', 
        GROUP_CONCAT(
            DISTINCT
            JSON_OBJECT(
                "calendar_detail_id", calendar_detail.id,
                "calendar_detail_day", calendar_detail.day,
                "calendar_detail_status", calendar_detail.status,
                "calendar_detail_title", calendar_detail.title,
                "calendar_detail_comment", calendar_detail.comment,
                "calendar_detail_create_account_id", calendar_detail.create_account_id,
                "calendar_detail_create_timestamp", calendar_detail.create_timestamp,
                "calendar_detail_update_account_id", calendar_detail.update_account_id,
                "calendar_detail_update_timestamp", calendar_detail.update_timestamp,
                "activity_request", (
                    SELECT
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                "activity_request_id", activity_request.id,
                                "activity_request_comment", activity_request.comment,
                                "activity_request_create_account_id", activity_request.create_account_id,
                                "activity_request_create_timestamp", activity_request.create_timestamp,
                                "activity_request_update_account_id", activity_request.update_account_id,
                                "activity_request_update_timestamp", activity_request.update_timestamp,
                                "activity_request_account_display_name", IFNULL(account.display_name, "UNKNOWN USER")
                            )
                        )
                    FROM
                        activity_request
                    LEFT OUTER JOIN
                        account
                    ON
                        activity_request.update_account_id = account.id
                    WHERE
                        activity_request.calendar_detail_id = calendar_detail.id
                )
            )
        ),
        ']'
    ) AS calendar_detail
FROM
    calendar
LEFT OUTER JOIN
    calendar_detail
ON
    calendar.id = calendar_detail.calendar_id
LEFT OUTER JOIN
    activity_request
ON
    calendar_detail.id = activity_request.calendar_detail_id
*/

/**
 * No. 8
 * API名: カレンダー設定情報取得
 * 通信方式: HTTP
 * HTTPメソッド: GET
 * エンドポイントURL: /calendar/{year}/{month}
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse<CalendarResponse>
 *
 * @returns void
 */
async function Get(
    req: NextApiRequest,
    res: NextApiResponse<CalendarResponse>
) {

    const { year, month }: Partial<{ [key: string]: string | string[]; }> = req.query;


    if ( ! year || ! month ) {

        return res.status( constHttp.BAD_REQUEST.code )
            .json(
                {
                    data: undefined,
                    error: {
                        message: `${ constHttp.BAD_REQUEST.message }`
                    }
                }
            );
    }


    const title: string = `${ year }${ month }`;


    let records: any[] = [];

    try {

        const query: Prisma.Sql = Prisma.sql`
            SELECT
                calendar.id AS calendar_id,
                calendar.title AS calendar_title,
                calendar.status AS calendar_status,
                calendar.answer_format_class AS answer_format_class,
                calendar.create_account_id AS calendar_create_account_id,
                calendar.create_timestamp AS calendar_create_timestamp,
                calendar.update_account_id AS calendar_update_account_id,
                calendar.update_timestamp AS calendar_update_timestamp,
                CONCAT(
                    '[', 
                    GROUP_CONCAT(
                        DISTINCT
                        JSON_OBJECT(
                            "calendar_detail_id", calendar_detail.id,
                            "calendar_detail_day", calendar_detail.day,
                            "calendar_detail_status", calendar_detail.status,
                            "calendar_detail_title", calendar_detail.title,
                            "calendar_detail_comment", calendar_detail.comment,
                            "calendar_detail_is_ease_edit_restrictions", calendar_detail.is_ease_edit_restrictions,
                            "calendar_detail_activity_class", calendar_detail.activity_class,
                            "calendar_detail_create_account_id", calendar_detail.create_account_id,
                            "calendar_detail_create_timestamp", calendar_detail.create_timestamp,
                            "calendar_detail_update_account_id", calendar_detail.update_account_id,
                            "calendar_detail_update_timestamp", calendar_detail.update_timestamp,
                            "activity_request", (
                                SELECT
                                    JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            "activity_request_id", activity_request.id,
                                            "activity_request_account_id", activity_request.account_id,
                                            "activity_request_answer_class", activity_request.answer_class,
                                            "activity_request_comment", activity_request.comment,
                                            "activity_request_create_account_id", activity_request.create_account_id,
                                            "activity_request_create_timestamp", activity_request.create_timestamp,
                                            "activity_request_update_account_id", activity_request.update_account_id,
                                            "activity_request_update_timestamp", activity_request.update_timestamp,
                                            "activity_request_account_display_name", IFNULL(account.display_name, "UNKNOWN USER")
                                        )
                                    )
                                FROM
                                    activity_request
                                LEFT OUTER JOIN
                                    account
                                ON
                                    activity_request.account_id = account.id
                                WHERE
                                    activity_request.calendar_detail_id = calendar_detail.id
                            )
                        )
                    ),
                    ']'
                ) AS calendar_detail
            FROM
                calendar
            LEFT OUTER JOIN
                calendar_detail
            ON
                calendar.id = calendar_detail.calendar_id
            LEFT OUTER JOIN
                activity_request
            ON
                calendar_detail.id = activity_request.calendar_detail_id
            WHERE
                calendar.title = ${title}
        `;
      
        records = await client.$queryRaw( query );

        if ( ! records.length ) {

            throw new Error;
        }

    } catch ( e: any ) {

        console.log(`${ e.name } ${ get_current_datetime_display() } ${ e.message }`);

        return res.status( constHttp.INTERNAL_SERVER_ERROR.code )
            .json({
                data: undefined,
                error: {
                    message: `${ constHttp.INTERNAL_SERVER_ERROR.message }`
                }
            }
        );
    }

    const record = records[0];

    const data: ResultCalendar = {
        calendar_id: parseInt( record.calendar_id, 10 ),
        calendar_title: record.calendar_title,
        calendar_status: record.calendar_status,
        answer_format_class: record.answer_format_class,
        calendar_create_account_id: parseInt( record.calendar_create_account_id, 10 ),
        calendar_create_timestamp: record.calendar_create_timestamp,
        calendar_update_account_id: parseInt( record.calendar_update_account_id, 10 ),
        calendar_update_timestamp: record.calendar_update_timestamp,
        calendar_detail: JSON.parse( record.calendar_detail )
    };


    return res.status( constHttp.OK.code ).json({ data: data });
}


/*
INSERT INTO
	`activity_request`
(
	`calendar_detail_id`,
	`account_id`,
	`answer_class`,
	`comment`,
	`create_account_id`,
	`update_account_id`
)
VALUES
(
	(
		SELECT
			id AS calendar_detail_id
		FROM 
			calendar_detail
		WHERE 
			calendar_id = ( SELECT id FROM calendar WHERE title = $1 )
		AND
			day = $2
	),
	$3,
	$4,
	$5,
	$3,
	$3
)
ON DUPLICATE KEY UPDATE
	`answer_class` = VALUES(`answer_class`),
	`comment` = VALUES(`comment`),
	`update_account_id` = VALUES(`update_account_id`)
*/


/**
 * No. 9
 * API名: 活動希望日登録
 * 通信方式: HTTP
 * HTTPメソッド: POST
 * エンドポイントURL: /calendar/{year}/{month}
 *
 * @param req NextApiRequest
 * @param res NextApiResponse
 *
 * @returns void
 */
async function Post(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { year, month }: Partial<{ [key: string]: string | string[]; }> = req.query;


    if ( ! year || ! month ) {

        return res.status( constHttp.BAD_REQUEST.code )
            .json(
                {
                    data: undefined,
                    error: {
                        message: `${ constHttp.BAD_REQUEST.message }`
                    }
                }
            );
    }

    const title: string = `${ year }${ month }`;


    const parameters = req.body;

    /**
     * デッドロックが発生する場合
     * https://dev.mysql.com/doc/refman/8.0/ja/insert-on-duplicate.html 
     * https://qiita.com/kshibata101/items/8807897cfe276fa2326f
     */
    const bindings: any[] = [];
    const values: string[] = [];


    for ( const parameter of parameters ) {

        values.push(`
            (
                (
                    SELECT
                        id AS calendar_detail_id
                    FROM 
                        calendar_detail
                    WHERE 
                        calendar_id = ( SELECT id FROM calendar WHERE title = ? )
                    AND
                        day = ?
                ),
                ?, ?, ?, ?, ?
            )
        `);

        bindings.push( title );
        bindings.push( parameter.day );
        bindings.push( account_id );
        bindings.push( parameter.answer_class );
        bindings.push( parameter.comment );
        bindings.push( account_id );
        bindings.push( account_id );
    }


    const query = `
        INSERT INTO
            activity_request
        (
            calendar_detail_id,
            account_id,
            answer_class,
            comment,
            create_account_id,
            update_account_id
        )
        VALUES
            ${ values.join(',') }
        ON DUPLICATE KEY UPDATE
            answer_class = VALUES( answer_class ),
            comment = VALUES( comment ),
            update_account_id = VALUES( update_account_id )
    `

    try {

        await client.$transaction( async client => client.$queryRawUnsafe( query, ...bindings ) );

    } catch ( e: any ) {

        console.log(`${ e.name } ${ get_current_datetime_display() } ${ e.message }`);

        return res.status( constHttp.INTERNAL_SERVER_ERROR.code )
            .json({
                data: undefined,
                error: {
                    message: `${ constHttp.INTERNAL_SERVER_ERROR.message }`
                }
            }
        );
    }


    return res.status( constHttp.NO_CONTENT.code ).end();
}
