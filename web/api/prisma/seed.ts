import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

/**
 * $ npx ts-node --files -r tsconfig-paths/register prisma/seed.ts
 */


const prisma: PrismaClient = new PrismaClient();

/** アカウント */
const account = {
    client: prisma.account,
    columns: [`id`, `address`, `register_name`, `display_name`, `class`, `status`, `password`, `remarks`, `login_datetime`, `video_connection_datetime`, `create_account_id`, `update_account_id`],
    data: [
        [1, "et@study-club.com", "et", "et", "03", "01", null, "et 備考", null, null, 10, 10],
        [2, "sy@study-club.com", "sy", "sy", "03", "01", null, "sy 備考", null, null, 10, 10],
        [3, "yt@study-club.com", "yt", "yt", "02", "01", null, "yt 備考", null, null, 10, 10],
        [4, "ko1@study-club.com", "ko1", "ko1", "03", "01", null, "ko1 備考", null, null, 10, 10],
        [5, "ta@study-club.com", "ta", "ta", "03", "01", null, "ta 備考", null, null, 10, 10],
        [6, "ko2@study-club.com", "ko2", "ko2", "03", "01", null, "ko2 備考", null, null, 10, 10],
        [7, "mt@study-club.com", "mt", "mt", "03", "01", null, "mt 備考", null, null, 10, 10],
        [8, "sn@study-club.com", "sn", "sn", "03", "01", null, "sn 備考", null, null, 10, 10],
        [9, "yo@study-club.com", "yo", "yo", "03", "01", null, "yo 備考", null, null, 10, 10],
        [10, "tm@study-club.com", "tm", "tm", "01", "01", null, "tm 備考", null, null, 10, 10],
        [11, "tk@study-club.com", "tk", "tk", "03", "01", null, "tk 備考", null, null, 10, 10],
        [12, "mi@study-club.com", "mi", "mi", "03", "01", null, "mi 備考", null, null, 10, 10],
        [13, "ri@study-club.com", "ri", "ri", "03", "01", null, "ri 備考", null, null, 10, 10],
        [14, "ks@study-club.com", "ks", "ks", "03", "01", null, "ks 備考", null, null, 10, 10],
        [15, "am@study-club.com", "am", "am", "03", "01", null, "am 備考", null, null, 10, 10],
        [16, "yy@study-club.com", "yy", "yy", "01", "01", null, "yy 備考", null, null, 10, 10],
        [17, "my@study-club.com", "my", "my", "03", "01", null, "my 備考", null, null, 10, 10],
        [18, "ya@study-club.com", "ya", "ya", "03", "01", null, "ya 備考", null, null, 10, 10],
        [19, "kt1@study-club.com", "kt1", "kt1", "03", "01", null, "kt1 備考", null, null, 10, 10],
        [20, "kt2@study-club.com", "kt2", "kt2", "03", "01", null, "kt2 備考", null, null, 10, 10],
        [21, "kt3@study-club.com", "kt3", "kt3", "03", "01", null, "kt3 備考", null, null, 10, 10],
        [22, "ty1@study-club.com", "ty1", "ty1", "03", "01", null, "ty1 備考", null, null, 10, 10],
        [23, "rk@study-club.com", "rk", "rk", "03", "01", null, "rk 備考", null, null, 10, 10],
        [24, "rh@study-club.com", "rh", "rh", "03", "01", null, "rh 備考", null, null, 10, 10],
        [25, "rt@study-club.com", "rt", "rt", "01", "01", null, "rt 備考", null, null, 10, 10],
        [26, "ny@study-club.com", "ny", "ny", "03", "01", null, "ny 備考", null, null, 10, 10],
        [27, "ty2@study-club.com", "ty2", "ty2", "03", "01", null, "ty2 備考", null, null, 10, 10],
        [28, "sh@study-club.com", "sh", "sh", "03", "01", null, "sh 備考", null, null, 10, 10],
        [29, "ki@study-club.com", "ki", "ki", "03", "01", null, "ki 備考", null, null, 10, 10],
        [30, "fu@study-club.com", "fu", "fu", "03", "01", null, "fu 備考", null, null, 10, 10],
        [31, "kk@study-club.com", "kk", "kk", "04", "01", null, "kk 備考", null, null, 10, 10],
        [32, "nm@study-club.com", "nm", "nm", "03", "02", null, "nm 備考", null, null, 10, 1]
    ]
} as { client: Prisma.AccountDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** ファイル情報 */
const file_info = {
    client: prisma.fileInfo,
    columns: [`id`, `management_id`, `sequence_number`, `class`, `name`, `extension`, `is_download`, `create_account_id`, `update_account_id`],
    data: [
        [1, 1, 1, "01", "20230712001800-1", "jpeg", 1, 1, 1],
        [2, 1, 1, "02", "20230712001800-1", "jpeg", 1, 1, 1],
        [3, 1, 1, "03", "20230712001800-1", "jpeg", 1, 1, 1]        
    ]
} as { client: Prisma.FileInfoDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** チャット */
const chat = {
    client: prisma.chat,
    columns: [`id`,`content`,`sequence_number`,`deleted_datetime`,`create_account_id`,`update_account_id`],
    data: [
        [1, "Hello study club!", 1, null, 1, 1],
        [2, "HELLO STUDY-CLUB:)", 2, null, 2, 2]
    ]
} as { client: Prisma.ChatDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** チャット閲覧情報 */
const chat_reading_info = {
    client: prisma.chatReadingInfo,
    columns: [`id`,`account_id`,`sequence_number`,`create_account_id`,`update_account_id`],
    data: [
        [1, 3, 1, 3, 3]
    ]
} as { client: Prisma.ChatReadingInfoDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** カレンダー */
const calendar = {
    client: prisma.calendar,
    columns: [`id`,`title`,`status`,`answer_format_class`,`create_account_id`,`update_account_id`],
    data: [
        [1,  Prisma.sql`DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y%m")`, "02", "01", 10, 10]
    ]
} as { client: Prisma.CalendarDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** カレンダー詳細 */
const calendar_detail = {
    client: prisma.calendarDetail,
    columns: [`id`,`calendar_id`,`day`,`status`,`title`,`comment`, `is_ease_edit_restrictions`, `activity_class`, `create_account_id`,`update_account_id`],
    data: [
        [1, 1, "01", "03", "オンライン活動予定日", "テーマは【みなさんオススメの甘い物】です!", true, "03", 10, 10],
        [2, 1, "20", "03", "skype + 研修室活動予定日", "テーマは【買ってよかったもの】です!", false, "02", 10, 10]        
    ]
} as { client: Prisma.CalendarDetailDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** 活動要望 */
const activity_request = {
    client: prisma.activityRequest,
    columns: [`id`,`calendar_detail_id`,`comment`,`create_account_id`,`update_account_id`],
    data: [
        [1, 1, "参加可能だが、10時に退出する", 1, 1],
        [2, 1, "参加可能だが、11時に退出する", 2, 2],
        [3, 1, "参加可能だが、12時に退出する", 3, 3],
        [4, 2, "参加可能だが、13時に退出する", 1, 1],
        [5, 2, "参加可能だが、14時に退出する", 2, 2],
        [6, 2, "参加可能だが、15時に退出する", 3, 3]
    ]
} as { client: Prisma.ActivityRequestDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** 匿名回答 */
/*
const anonymous_answer = {
    client: prisma.anonymousAnswer,
    columns: [`id`,`calendar_id`,`answer_crypt_string`,`create_account_id`,`update_account_id`],
    data: []
} as { client: Prisma.AnonymousAnswerDelegate<DefaultArgs>; columns: string[]; data: any[]; };
*/
/** 告知 */
const notice = {
    client: prisma.notice,
    columns: [`id`,`class`,`is_publish`,`is_list_display`,`title`,`description`,`publish_start_datetime`,`publish_end_datetime`,`url`,`content`,`remarks`,`create_account_id`,`update_account_id`],
    data: [
        [
            1,
            "01",
            1,
            1,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "ランチミーティング")`,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            Prisma.sql`DATE_FORMAT(NOW(), "%Y%m%d000000")`,
            Prisma.sql`DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 YEAR), "%Y%m%d000000")`,
            null,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            "体験参加者1名含む",
            10,
            10        
        ], [
            2,
            "02",
            1,
            1,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "ランチミーティング")`,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            Prisma.sql`DATE_FORMAT(NOW(), "%Y%m%d000000")`,
            Prisma.sql`DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 YEAR), "%Y%m%d000000")`,
            "lunch",
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            "体験参加者1名含む",
            10,
            10        
        ]
    ]
} as { client: Prisma.NoticeDelegate<DefaultArgs>; columns: string[]; data: any[]; };
/** 告知プレビュー */
const notice_preview = {
    client: prisma.noticePreview,
    columns: [`id`,`notice_id`,`title`,`description`,`content`,`access_code`,`create_account_id`,`update_account_id`],
    data: [
        [
            1,
            2,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "ランチミーティング")`,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            Prisma.sql`CONCAT(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), "%Y/%m/01"), " ",  "活動後のランチミーティングの参加有無について")`,
            "testcode",
            10,
            10
        ]
    ]
} as { client: Prisma.NoticePreviewDelegate<DefaultArgs>; columns: string[]; data: any[]; };


/**
 as Prisma.AccountUncheckedCreateInput[]
 */

async function main() {

    const schemas = [
        account,
        file_info,
        chat,
        chat_reading_info,
        calendar,
        calendar_detail,
        activity_request,
        notice,
        notice_preview
    ];

    console.log(`Begin`)

    for ( const schema of schemas ) {

        const query = [];

        for ( const data of schema.data ) {

            const create_data:
                Prisma.AccountCreateInput |
                Prisma.FileInfoCreateInput |
                Prisma.ChatCreateInput |
                Prisma.ChatReadingInfoCreateInput |
                Prisma.CalendarCreateInput |
                Prisma.CalendarDetailCreateInput |
                Prisma.ActivityRequestCreateInput |
                Prisma.NoticeCreateInput |
                Prisma.NoticePreviewCreateInput
            = await schema.columns.reduce( (p, c, i) => {

                p[ c ] = data[ i ];

                return p;
            // }, {} as { [ key: string]: any } );
            }, {} as any);


            // schema.client.create( create_data );

            const schema_client:
                Prisma.AccountDelegate<DefaultArgs> |
                Prisma.FileInfoDelegate<DefaultArgs> |
                Prisma.ChatDelegate<DefaultArgs> |
                Prisma.ChatReadingInfoDelegate<DefaultArgs> |
                Prisma.CalendarDelegate<DefaultArgs> |
                Prisma.CalendarDetailDelegate<DefaultArgs> |
                Prisma.ActivityRequestDelegate<DefaultArgs> | 
                Prisma.NoticeDelegate<DefaultArgs> | 
                Prisma.NoticePreviewDelegate<DefaultArgs>
            = schema.client;

            const create_func:
                Prisma.AccountCreateArgs<DefaultArgs> |
                Prisma.FileInfoCreateArgs<DefaultArgs> |
                Prisma.ChatCreateArgs<DefaultArgs> |
                Prisma.ChatReadingInfoCreateArgs<DefaultArgs> |
                Prisma.CalendarCreateArgs<DefaultArgs> |
                Prisma.CalendarDetailCreateArgs<DefaultArgs> |
                Prisma.ActivityRequestCreateArgs<DefaultArgs> |
                Prisma.NoticeCreateArgs<DefaultArgs> |
                Prisma.NoticePreviewCreateArgs<DefaultArgs> |
                any
            = schema_client.create;
            
            query.push( await create_func( { data: create_data } ) );
        }

        await prisma.$transaction( query )
    }

    console.log(`Finished`)
}
  

main()
  .then(async () => {

    await prisma.$disconnect()
  })
  .catch(async (e) => {

    console.error(e)

    await prisma.$disconnect()
    process.exit(1)
  })
