// import type { useRouter } from 'next/router';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as mariadb from 'mariadb';

type Calendar = {
    data: object | undefined
}

/** calendar/year/month */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Calendar>
) {

    const connection:mariadb.Pool = mariadb.createPool({
        host: 'localhost',
        user: 'yt',
        password: 'password',
        database: 'study_club'
    });

    let ret: object | undefined;

    try {

        const conn: mariadb.PoolConnection | undefined = await connection.getConnection();

        ret = await conn.query(`
SELECT
    calendar.id AS calendar_id,
    calendar.title AS calendar_title,
    calendar.status AS calendar_status,
    calendar.answer_format_class AS answer_format_class,
    calendar.create_account_id AS calendar_create_account_id,
    calendar.create_timestamp AS calendar_create_timestamp,
    calendar.update_account_id AS calendar_update_account_id,
    calendar.update_timestamp AS calendar_update_timestamp,
    calendar_detail.id AS calendar_detail_id,
    calendar_detail.day AS calendar_detail_day,
    calendar_detail.status AS calendar_detail_status,
    calendar_detail.title AS calendar_detail_title,
    calendar_detail.comment AS calendar_detail_comment,
    calendar_detail.create_account_id AS calendar_detail_create_account_id,
    calendar_detail.create_timestamp AS calendar_detail_create_timestamp,
    calendar_detail.update_account_id AS calendar_detail_update_account_id,
    calendar_detail.update_timestamp AS calendar_detail_update_timestamp,
    activity_request.id AS activity_request_id,
    activity_request.comment AS activity_request_comment,
    activity_request.create_account_id AS activity_request_create_account_id,
    activity_request.create_timestamp AS activity_request_create_timestamp,
    activity_request.update_account_id AS activity_request_update_account_id,
    activity_request.update_timestamp AS activity_request_update_timestamp
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
        `);

    } catch( err ) {

        throw err;
    }

    res.status(200).json({ data: ret });
}

/**
SELECT
    calendar.id AS calendar_id,
    calendar.title AS calendar_title,
    calendar.status AS calendar_status,
    calendar.answer_format_class AS answer_format_class,
    calendar.create_account_id AS calendar_create_account_id,
    calendar.create_timestamp AS calendar_create_timestamp,
    calendar.update_account_id AS calendar_update_account_id,
    calendar.update_timestamp AS calendar_update_timestamp,
    calendar_detail.id AS calendar_detail_id,
    calendar_detail.day AS calendar_detail_day,
    calendar_detail.status AS calendar_detail_status,
    calendar_detail.title AS calendar_detail_title,
    calendar_detail.comment AS calendar_detail_comment,
    calendar_detail.create_account_id AS calendar_detail_create_account_id,
    calendar_detail.create_timestamp AS calendar_detail_create_timestamp,
    calendar_detail.update_account_id AS calendar_detail_update_account_id,
    calendar_detail.update_timestamp AS calendar_detail_update_timestamp,
    activity_request.id AS activity_request_id,
    activity_request.comment AS activity_request_comment,
    activity_request.create_account_id AS activity_request_create_account_id,
    activity_request.create_timestamp AS activity_request_create_timestamp,
    activity_request.update_account_id AS activity_request_update_account_id,
    activity_request.update_timestamp AS activity_request_update_timestamp
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