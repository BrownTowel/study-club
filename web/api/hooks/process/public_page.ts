// import { public_pages } from '../../lib/types/globals';
// const { client } = require("@/prisma/client");
import { client } from "@/prisma/client";
import type { PublicPage } from '@/lib/types/globals';
import { datetime_string_to_date, get_current_datetime } from "@/lib/utility/date_format";

const WEB = "02";
const TRUE = true;

export const get_public_pages = async function(): Promise<PublicPage[]> {

    const record = await client.notice.findMany(
        {
            where: {
                class: WEB,
                isPublish: TRUE
            }
        }
    );


    const public_pages: PublicPage[] = [];

    for ( const r of record ) {

        public_pages.push({
            id: r.id,
            title: r.title,
            description: r.description,
            publishStartDatetime: r.publishStartDatetime,
            publishEndDatetime: r.publishEndDatetime,
            url: r.url,
            content: r.content
        } as PublicPage );
    }


    return public_pages;
}

/**
 * パス情報から公開告知ページの情報を取得して返す.
 * 該当情報がない場合、または公開告知ページが公開期間外の場合は404情報を返却する.
 * 
 * @SEE ./lib/types/globals | interface public_page
 * @param public_page
 *
 * @returns [ number, { [ key: string ]: string }, string, string ]
 */
export const public_notice = ( public_page: any ): [ number, { [ key: string ]: string }, string, string ] => {

    let status: number;
    let content: string;
  
    const content_type: { [ key: string ]: string } = { "Content-Type": "text/html; charset=utf-8" };
    const encoding: string = "utf-8";;
  
    const current_datetime = get_current_datetime().getTime();
    const publish_start_datetime = datetime_string_to_date( public_page.publishStartDatetime ).getTime();
    const publish_end_datetime = datetime_string_to_date( public_page.publishEndDatetime ).getTime();
  
    if (
      publish_start_datetime > current_datetime ||
      current_datetime > publish_end_datetime
    ) {
      /** 公開期間外 */
      status = 404;
      content = ``;
  
      return [ status, content_type, content, encoding ];
    }
  
  
    status = 200;
    content = public_page.content;
  
  
    return [ status, content_type, content, encoding ];
  }
  