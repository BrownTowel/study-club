# include <stdio.h>
# include <stdlib.h>
# include <time.h>
# include <string.h>
# include <mysql/mysql.h>
# include "headers/env.h"
# include "headers/global.h"

# define CALENDAR_STATUS "02"

int main ( int argc, char *argv )
{

    printf ("**** Begin ****\n");

    /**
     * @todo タイマー処理
     * 
     * 一旦、タイマー処理の中身だけ実装する.
     */

    /** サーバーの現在日時を時刻型(time_t)の変数として格納 */
    auto time_t current_t = time( NULL );
    /** JSTに変換する. */
    struct tm *local = localtime( &current_t );

    /** @todo タイマー処理実装後に変数のスコープ整理 */
    /** @todo マクロ整理 */

    /** yyyydd文字列と終端文字のバイト数 */
    auto unsigned long ym_buf_size = sizeof ( "000000" );
    /** dd文字列と終端文字のバイト数 */
    auto unsigned long d_buf_size = sizeof ( "00" );


    auto char ym[ ym_buf_size ];
    auto char d[ d_buf_size ];

    /** yyyyMMとddの数値を取得し変数に格納する. */
    strftime ( ym, sizeof ( ym ), "%Y%m", local );
    strftime ( d, sizeof ( d ), "%d", local );

    /** debug @deleteme @delete */
    printf( "yyymm: %s\n", ym );
    printf( "dd: %s\n", d );


    /** SQLQuery文字列の先頭アドレス格納用ポインター変数 */
    char *sql;
    /** 動的確保のバイト数 */
    // int n;
    int n = 255;

    size_t sql_size = sizeof ( char ) * n;

    /** SQLQuery文字列の動的領域を確保し先頭アドレスを取得 */
    sql = ( char* ) malloc ( sql_size );

    if ( NULL == sql )
    {

        printf ( "%s %s: %d Abort memory allocation is failed.\n", __FILE__, __func__, __LINE__ );

        exit(1);
    }

    /** SQLQueryを生成して格納する. */
    snprintf (
        sql,
        sql_size,
        "SELECT "
            "calendar_detail.title, "
            "calendar_detail.comment "
        "FROM "
            "calendar "
        "INNER JOIN "
            "calendar_detail "
        "ON "
            "calendar.id = calendar_detail.calendar_id "
        "WHERE "
            "calendar.status = ? "
        "AND "
            "calendar.title = ? "
        "AND "
            "calendar_detail.day = ?"
    );

    if ( NULL == sql )
    {
    
        printf ( "%s %s: %d memory allocation invalid size.\n", __FILE__, __func__, __LINE__ );

        exit(1);
    }

    if ( sizeof ( sql ) > sql_size )
    {

        free ( sql );

        printf ( "sql_size: %ld, sizeof: %lu\n", sql_size, sizeof ( sql ) );

        exit(1);
    }

    printf ( "%s\n", sql );


    /** @todo エラーハンドルとリソース開放 */
    /** @todo ログ処理の共通化 */

    /** 接続テスト */
    /** @todo コネクションの常駐化 */


    conn = mysql_init ( NULL );


    /** コネクションの確立 */
    if (
        ! mysql_real_connect (
            conn,
            DB_HOST,
            DB_USER,
            DB_PASSWORD,
            DB_NAME,
            3306,
            NULL,
            0
        )
    )
    {

        free ( sql );

        fprintf ( stderr, "%s\n", mysql_error ( conn ) );
        /** @warning retry */
        exit(1);
    }

    /** 文字コード設定 */
    /** @todo 想定と動きが違うので条件を反転 */
    // if ( ! mysql_set_character_set ( conn, "utf8" ) )
    if ( mysql_set_character_set ( conn, "utf8" ) )
    {

        free ( sql );

        fprintf ( stderr, "%s\n", mysql_error ( conn ) );
        /** @warning retry */
        exit(1);
    }


    fprintf ( stdout, "Connection: mysql://%s:3306/%s\n", DB_HOST, DB_NAME );

    /** @note 接続確立ここまで */
    /** @todo 再接続処理とリトライの閾値設定 */


    /** プリペアドステートメントの構造体を生成して先頭アドレスを取得 */
    MYSQL_STMT *stmt = mysql_stmt_init ( conn );

    if ( NULL == stmt )
    {

        free ( sql );

        printf ( "%s %s: %d Abort memory allocation is failed.\n", __FILE__, __func__, __LINE__ );

        exit(1);
    }

    /** クエリの発行 */
    if ( mysql_stmt_prepare ( stmt, sql, strnlen ( sql, sql_size ) ) )
    {

        free ( sql );

        fprintf ( stderr, "%s\n", mysql_error ( conn ) );

        exit(1);
    }

    free ( sql );


    /**
     * C APIステートメントデータタイプ
     *
     * リファレンス
     * https://dev.mysql.com/doc/dev/mysql-server/latest/structMYSQL__BIND.html
     *
     * type
     * https://dev.mysql.com/doc/c-api/8.0/en/c-api-prepared-statement-type-codes.html
     */

    /** バインド変数の長さ分のMYSQL_BIND構造体配列を宣言 */
    MYSQL_BIND bind[ 3 ] = { 0 };
    // MYSQL_BIND bind[ 3 ];
    // memset ( bind, 0, sizeof ( bind ) );

    /** calendar.status */
    bind[ 0 ].buffer_type   = MYSQL_TYPE_STRING;
    bind[ 0 ].buffer        = CALENDAR_STATUS;
    bind[ 0 ].buffer_length = 2;
    /** calendar.title */
    bind[ 1 ].buffer_type   = MYSQL_TYPE_STRING;
    bind[ 1 ].buffer        = ym;
    bind[ 1 ].buffer_length = 6;
    /** calendar_detail.day */
    bind[ 2 ].buffer_type   = MYSQL_TYPE_STRING;
    bind[ 2 ].buffer        = "20";
    bind[ 2 ].buffer_length = 2;

    /** カレンダー情報 格納用構造体 */
    struct batch_01_query_result
    {
        unsigned char calendar_detail_title[ 256 ];
        unsigned char calendar_detail_comment[ 800 ];
    };
    /** カレンダー情報の構造体初期化処理. */
    struct batch_01_query_result calendar = { 0 };

    /** 取得結果の構造体初期化処理. */
    MYSQL_BIND result[ 3 ] = { 0 };


    /** calendar_detail.title */
    result[ 0 ].buffer_type = MYSQL_TYPE_STRING;
    result[ 0 ].buffer = &calendar.calendar_detail_title[ 0 ];
    result[ 0 ].buffer_length = 256;
    /** calendar_detail.comment */
    result[ 1 ].buffer_type = MYSQL_TYPE_STRING;
    result[ 1 ].buffer = &calendar.calendar_detail_comment[ 0 ];
    result[ 1 ].buffer_length = 800;



    /** バインドパラメーターの定義をセット */
    if ( mysql_stmt_bind_param ( stmt, bind ) )
    {

        fprintf ( stderr, "%s\n", mysql_error ( conn ) );

        exit(1);
    }
    /** 出力先バッファの定義をセット */
    if ( mysql_stmt_bind_result ( stmt, &result[0] ) )
    {

        fprintf ( stderr, "%s\n", mysql_error ( conn ) );

        exit(1);
    }


    // if ( mysql_stmt_store_result ( stmt ) )
    // {

    //     fprintf ( stderr, "%s\n", mysql_error ( conn ) );

    //     exit(1);
    // }

    mysql_stmt_execute( stmt );

    int ret = mysql_stmt_fetch ( stmt );

    if ( MYSQL_NO_DATA == ret  )
    {

        fprintf ( stderr, "MYSQL_NO_DATA\n" );
        /** データが存在しないケース要確認 */
    } else if ( 0 != ret ) {

        fprintf ( stderr, "%s\n", mysql_stmt_error ( stmt ) );

        exit(1);
    }

    /** debug @deleteme */
    printf ( "%s\n", calendar.calendar_detail_title );
    printf ( "%s\n", calendar.calendar_detail_comment );



    /** 簡易取得用処理 */
    // if ( mysql_query ( conn, sql ) )
    // {

    //     fprintf ( stderr, "%s %s: %d %s\n", __FILE__, __func__, __LINE__, mysql_error ( conn ) );

    //     exit(1);
    // }


    // res = mysql_use_result ( conn );

    // while ( ( row = mysql_fetch_row ( res ) ) != NULL )
    // {

    //     // 結果表示 確認用
    //     int size = sizeof ( row );

    //     while ( size-- ) {

    //         printf( "%s\n", row[size] );
    //     }
    // }

    // /** リソース解放 */
    // mysql_free_result ( res );

    // 切断 @deleteme
    mysql_close ( conn );

    
    /**
     * DBのデータ取得ここまで.
     * 
     * @todo
     * DB接続時の文字コードセットがこけている気がする.
     * 条件を逆にすることでエラーをスキップして、取得する分には問題なく取れているが指定できるならしておきたい.
     *
     * @todo
     * websocket開発後にwebsocket通信の確立する.
     * 確立後に送信処理と切断.
     * 
     * 受信側
     * ループバックアドレスでのアクセス時にtokenの認証を行わない.
     * ループバックアドレスでの接続時にはシステムユーザーアカウントとする.
     * 
     * DB側
     * 必要ならシステムユーザーアカウントのレコードを作る.
    */


    printf ("**** End ****\n");


    return 1;
}
