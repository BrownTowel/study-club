// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import * as mariadb from 'mariadb';
// import type { Account, ResultNormal, ResultQuery } from '@/lib/types/account/type';
import type { Account, ResultNormal } from '@/lib/types/account/type';
import { client } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { http as constHttp } from '@/lib/constant/http'

const STATUS_ENABLE = "01";

/*
** Base SQL ************

SELECT
  id,
  address,
  register_name,
  display_name,
  class,
  status,
  remarks,
  login_datetime,
  video_connection_datetime,
  create_account_id,
  create_timestamp,
  update_account_id,
  update_timestamp
FROM
  account
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Account>
) {

  // const { limit, offset, id }: Partial<{ [key: string]: string | string[] }> = req.query;

  /**
   * id || limit && offset
   */



  /** あとでprismaに置き換え */
  // const connection:mariadb.Pool = mariadb.createPool({
  //   host: 'localhost',
  //   user: 'yt',
  //   password: 'password',
  //   database: 'study_club'
  // });


  // let ret: ResultQuery[] = [];

  // try {

  //   const conn: mariadb.PoolConnection | undefined = await connection.getConnection();

  //   ret = await conn.query(`${BASE_SQL} WHERE status = ?`, STATUS_ENABLE);
  
  // } catch(err) {

  //   throw err;
  // }

  const query_option: Prisma.AccountFindManyArgs = { where: { status: STATUS_ENABLE } };

  const records = await client.account.findMany( query_option );


  const data: ResultNormal[] = records.map( record => {

    return {
      id: record.id,
      display_name: record.displayName
    }
  } );


  return res.status( constHttp.OK.code ).json({ data: data });
}
