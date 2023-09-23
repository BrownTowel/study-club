/**
 *  1 | アカウント認証
 *  2 | 認証アカウント情報取得
 *  3 | 告知情報取得
 *  4 | チャットコンテンツ取得
 *  5 | チャットコンテンツ登録
 *  6 | チャットコンテンツ編集
 *  7 | チャットコンテンツ削除
 *  8 | カレンダー設定情報取得
 *  9 | 活動希望日登録
 * 10 | カレンダー設定情報登録
 * 11 | 告知情報作成
 * 12 | 告知プレビュー情報作成
 * 13 | 告知情報更新
 * 14 | アカウント情報取得
 * 15 | アカウント情報作成
 * 16 | アカウント情報更新
 * 17 | サーバーリソース情報取得
 */
export enum ApiNo {
    POST_AUTH_CREDENTIAL = '1',
    POST_AUTH_ACCOUNT = '2',
    GET_NOTICE = '3',
    GET_CHAT_CONTENTS = '4',
    POST_CHAT_CONTENTS = '5',
    UPDATE_CHAT_CONTENTS = '6',
    DELETE_CHAT_CONTENTS = '7',
    GET_CALENDAR = '8',
    POST_CALENDAR = '9',
    POST_CALENDAR_SETTING = '10',
    POST_NOTICE = '11',
    POST_PREVIEW = '12',
    UPDATE_NOTICE = '13',
    GET_ACCOUNT = '14',
    POST_ACCOUNT = '15',
    UPDATE_ACCOUNT = '16',
    GET_DEVELOP_RESOURCE = '17',
}
/**
 * S-00-01	ログイン画面
 * S-01-01	エントランス画面
 * S-02-01	ビデオチャット画面
 * S-03-01	活動日カレンダー画面
 * S-03-02	活動日カレンダー設定画面
 * S-04-01	告知一覧画面
 * S-04-02	告知登録画面
 * S-04-03	告知詳細画面
 * S-04-04	告知編集画面
 * S-05-01	アカウント一覧画面
 * S-05-02	アカウント登録画面
 * S-05-03	アカウント詳細画面
 * S-05-04	アカウント編集画面
 * S-06-01	サーバーリソース監視画面
 * S-07-01	環境設定画面
*/
export enum ScreenID {
    LOGIN = "S-00-01",
    ENTRANCE = "S-01-01",
    ROOM = "S-02-01",
    CALENDAR = "S-03-01",
    CALENDAR_SETTING = "S-03-02",
    NOTICE = "S-04-01",
    NOTICE_NEW = "S-04-02",
    NOTICE_DETAIL = "S-04-03",
    NOTICE_EDIT = "S-04-04",
    ACCOUNT = "S-05-01",
    ACCOUNT_NEW = "S-05-02",
    ACCOUNT_DETAIL = "S-05-03",
    ACCOUNT_EDIT = "S-05-04",
    DEVELOP_RESOURCE = "S-06-01",
    SETTING = "S-07-01",
}

export interface constAPIPermission {
    api_no: ApiNo,
    screen_id_list: ScreenID[],
    operation: 'C' | 'R' | 'U' | 'D'
}

export const api_permissions: constAPIPermission[] = [

    {
        api_no: ApiNo.GET_CALENDAR,
        screen_id_list: [
            ScreenID.CALENDAR,
            ScreenID.CALENDAR_SETTING
        ],
        operation: 'R'
    },

    {
        api_no: ApiNo.POST_CALENDAR,
        screen_id_list: [
            ScreenID.CALENDAR
        ],
        operation: 'C'
    },

    {
        api_no: ApiNo.POST_CALENDAR_SETTING,
        screen_id_list: [
            ScreenID.CALENDAR_SETTING
        ],
        operation: 'C'
    }

];
