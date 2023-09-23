import type { NextApiRequest, NextApiResponse } from 'next';
import type { UpsertCalendarData } from '@/lib/types/calendar/type';
import { Prisma } from "@prisma/client";
import { client } from "@/prisma/client";
import { get_current_datetime_display } from '@/lib/utility/date_format';
import { http as constHttp } from '@/lib/constant/http';
import { verification } from '@/hooks/auth/token';
import { ApiNo } from "@/lib/constant/api_permission";
import type { Verification } from '@/lib/types/auth/type';
import { CALENDAR } from "@/lib/constant/const";

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

        case "POST":

            act = Post;
            api_no = ApiNo.POST_CALENDAR_SETTING;

            break;

        default:

            return res.status( constHttp.METHOD_NOT_ALLOWED.code ).send({
                message: `${ constHttp.METHOD_NOT_ALLOWED.message } Only POST requests allowed.`
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

    const parameter = req.body;

    console.log(title, parameter)

    const find_query_option: Prisma.CalendarFindUniqueArgs = { where: { title: title } };

    const calendar: any = await client.calendar.findUnique( find_query_option );

    let ret : boolean = false;

    if ( ! calendar ) {
        /** カレンダー新規作成時 */
        ret = await client.$transaction( async client => {
            /** calendar 新規作成 */
            const result = await client.calendar.create( {
                data: {
                    title: title,
                    answerFormatClass: parameter.answer_format_class,
                    createAccountId: account_id,
                    updateAccountId: account_id
                }
            } );

            /** calendar_detail 新規作成 */
            const data = parameter.calendar_detail_days.map( ( day: string ) => {

                return {
                    calendarId: result.id,
                    day: day,
                    title: ``, // @todo
                    comment: ``, // @todo
                    isEaseEditRestrictions: 0, // @todo
                    activityClass: `01`, // @todo
                    createAccountId: account_id,
                    updateAccountId: account_id
                };
            } );

            await client.calendarDetail.createMany({ data: data });

            return true;
        });
    } else if ( ! parameter.is_register ) {
        /** カレンダー編集時 */
        ret = await client.$transaction( async client => {

            await client.calendar.update( {
                where: { id: calendar.id },
                data: { updateAccountId: account_id }
            } );

            interface UpsertCalendarData {
                calendarId: number;
                day: string;
                title: string;
                comment: string;
                isEaseEditRestrictions: boolean;
                activityClass: string;
                createAccountId: number;
                updateAccountId: number;
            };

            const data = parameter.calendar_detail_days.map( ( day: string ) : UpsertCalendarData => {

                return {
                    calendarId: calendar.id,
                    day: day,
                    title: ``, // @todo
                    comment: ``, // @todo
                    isEaseEditRestrictions: false, // @todo
                    activityClass: `01`, // @todo
                    createAccountId: account_id,
                    updateAccountId: account_id
                };
            } );

            data.forEach( async ( d: UpsertCalendarData ) => {

                await client.calendarDetail.upsert({
                    where: { calendarId: d.calendarId, day: d.day } as Prisma.CalendarDetailWhereUniqueInput,
                    update: {
                        calendarId: d.calendarId,
                        day: d.day,
                        title: ``, // @todo
                        comment: ``, // @todo
                        isEaseEditRestrictions: false, // @todo
                        activityClass: `01`, // @todo
                        updateAccountId: account_id
                    } as Prisma.CalendarDetailUpdateInput,
                    create: {
                        calendarId: d.calendarId,
                        day: d.day,
                        title: ``, // @todo
                        comment: ``, // @todo
                        isEaseEditRestrictions: false, // @todo
                        activityClass: `01`, // @todo
                        createAccountId: account_id,
                        updateAccountId: account_id
                    }
                });

            });

            return true;
        });

    } else if ( parameter.is_register ) {
        /** カレンダー確定時 @TODO */
        ret = await client.$transaction( async client => {

            await client.calendar.update( {
                where: { id: calendar.id },
                data: {
                    status: `01`,
                    updateAccountId: account_id
                }
            } );


            interface UpdateCalendarData {
                calendarId: number;
                day: string;
                title: string;
                comment: string;
                isEaseEditRestrictions: boolean;
                activityClass: string;
                createAccountId: number;
                updateAccountId: number;
            };


            const data = parameter.calendar_detail_days.map( ( day: string ) : UpdateCalendarData => {

                return {
                    calendarId: calendar.id,
                    day: day,
                    title: ``, // @todo
                    comment: ``, // @todo
                    isEaseEditRestrictions: false, // @todo
                    activityClass: `01`, // @todo
                    createAccountId: account_id,
                    updateAccountId: account_id
                };
            } );

            data.forEach( async ( d: UpdateCalendarData ) => {

                await client.calendarDetail.upsert({
                    where: { calendarId: d.calendarId, day: d.day } as Prisma.CalendarDetailWhereUniqueInput,
                    update: {
                        calendarId: d.calendarId,
                        day: d.day,
                        title: ``, // @todo
                        comment: ``, // @todo
                        isEaseEditRestrictions: false, // @todo
                        activityClass: `01`, // @todo
                        updateAccountId: account_id
                    } as Prisma.CalendarDetailUpdateInput,
                    create: {
                        calendarId: d.calendarId,
                        day: d.day,
                        title: ``, // @todo
                        comment: ``, // @todo
                        isEaseEditRestrictions: false, // @todo
                        activityClass: `01`, // @todo
                        createAccountId: account_id,
                        updateAccountId: account_id
                    }
                });

            });

            return true;

        });

    } else if ( calendar.status === CALENDAR.STATUS.COMFIRM ) {
        /** カレンダー確定後 */
        ret = await client.$transaction( async client => {

            return true;
        });
    }

    /** 操作を明確にするためカレンダーステータスを判定（確定時） またはリクエストパラメーターに追加 またはAPI追加 確定ステータスのカレンダー詳細情報が来る? */

/*

活動候補日の削除SQL

DELETE
FROM
	activity_request
WHERE
	calendar_detail_id IN (
        SELECT
            id
        FROM
            calendar_detail
        WHERE
            calendar_id = :calendar.id
            AND day NOT IN ( :calendar_detail.day )
    )

DELETE
FROM
	calendar_detail
WHERE
	calendar_id = :calendar.id
	AND day NOT IN ( :calendar_detail.day )

* カレンダー新規作成時（カレンダーステータス: 検討中）
カレンダー詳細 | bulk insert

* カレンダー編集時（カレンダーステータス: 検討中）
カレンダー詳細 | bulk upsert

* カレンダー確定時 (確定ステータスのカレンダー詳細情報が来る)
カレンダー詳細 | bulk upsert

calendar {
  id: 1,
  title: '202309',
  status: '02',
  answerFormatClass: '01',
  createAccountId: 10,
  createTimestamp: 2023-09-07T22:42:46.000Z,
  updateAccountId: 10,
  updateTimestamp: 2023-09-07T22:44:16.000Z
}


{
  answer_format_class: '01',
  calendar_detail_days: [
    '01', '08', '14',
    '15', '21', '22',
    '28', '29'
  ]
}
*/


    if ( ! ret ) {

        return res.status( constHttp.INTERNAL_SERVER_ERROR.code )
            .json({
                data: undefined,
                error: {
                    message: `${ constHttp.INTERNAL_SERVER_ERROR.message }`
                }
            });
    }

    return res.status( constHttp.NO_CONTENT.code ).end();
}