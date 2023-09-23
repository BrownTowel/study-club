/**
 * ********************************
 *      システム規定値             *
 **********************************
*/

/*
 * 権限区分	運営	01
 * 	       開発	   02
 * 	       汎用	   03
 * 	       一時利用	04
 * 権限種別	参照	R
 * 	       新規登録	C
 * 	       更新	    U
 * 	       削除	    D
 */
export const AUTHORITY = {

    CLASS: {
        ADMIN: "01",
        DEVELOP: "02",
        GENERAL: "03",
        PROVISIONAL: "04"
    },

    TYPE: {
        READ: "R",
        CREATE: "C",
        UPDATE: "U",
        DELETE: "D"
    }
}

/**
 * アカウントステータス	有効	01
 * 	                  無効    02
 */
export const ACCOUNT = {

    STATUS: {
        VALID: "01",
        INVALID: "02"
    }

};

/**
 * カレンダーステータス	確定    01
 * 	                  検討中   02
 * 		
 * 回答形式区分	       記名 	01
 * 	                  匿名     02
 */
export const CALENDAR = {

    STATUS: {
        COMFIRM: "01",
        CONSIDER: "02"
    },

    ANSWER_FORMAT_CLASS: {
        SIGNED: "01",
        SECRET: "02"
    }

};

/**
 * カレンダー詳細ステータス	活動実績日	01
 * 	                      活動予定日  02
 * 	                      活動候補日  03
 * 		
 * 活動区分	なし       01
 * 	       オンライン  02
 * 	       研修室      03
 */
export const CALENDAR_DETAIL = {

    STATUS: {
        ACHIEVEMENT: "01",
        EXPECT: "02",
        CANDIDATE: "03"
    },

    ACTIVITY_CLASS: {
        NONE: "01",
        ONLINE: "02",
        NOT_ONLY_ONLINE: "03"
    },

    ACTIVITY_CLASS_NONE: `なし`,
    ACTIVITY_CLASS_ONLINE: `オンライン`,
    ACTIVITY_CLASS_NOT_ONLY_ONLINE: `研修室 + オンライン`,

};

/**
 * 回答区分 〇 01
 *          △ 02
 *          × 03
 */
export const ACTIVITY_REQUEST = {

    ANSWER_CLASS: {
        ROUND: "01",
        TRIANGLE: "02",
        CROSS: "03"
    }
}

/**
 * 告知区分	内部	01
 * 	        WEB    02
 */
export const NOTICE = {

    CLASS: {
        INTERNAL: "01",
        WEB: "02",
    } 

}

/**
 * ファイル区分	アカウント	01
 * 	           チャット    02
 * 	           告知        03
 */
export const FILE = {

    CLASS: {
        ACCOUNT: "01",
        CHAT: "02",
        NOTICE: "03",
    } 

}



/**
 * ********************************
 *      システム定数               *
 **********************************
*/

/** 認証トークン名称 */
export const AUTH_TOKEN = "auth_token";
/** トークン期限切れレスポンス */
export const EXPIRED_TOKEN_RESPONSE_MESSAGE = "Invalid Request expired token";

/**
 * websocket / webRTC
 */
export const WEB_SOCKET = {

    CONNECTION: "connection",

    RECEIVER: {

        CHAT: {
            FETCH: "fetch",
            POST: "post",
            EDIT: "edit",
            DELETE: "delete",
            READ: "read",
        },

        VIDEO: "video",
        VIDEO_KILL: "video_kill"
    }
}

