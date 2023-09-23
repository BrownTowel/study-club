import { Login } from './pages/login';
import { Entrance } from './pages/app/entrance';
import { Calendar } from './pages/app/calendar';
import { CalendarSetting } from './pages/app/calendar_setting';


/**
 * Routes
 *    S-00-01	ログイン画面              /login
 *    S-01-01	エントランス画面          /app
 *    S-02-01	ビデオチャット画面        /app/room
 *    S-03-01	活動日カレンダー画面      /app/calendar
 *    S-03-02	活動日カレンダー設定画面  /app/calendar/setting
 *    S-04-01	告知一覧画面             /app/notice
 *    S-04-02	告知登録画面             /app/notice/new
 *    S-04-03	告知詳細画面             /app/notice/{id}
 *    S-04-04	告知編集画面             /app/notice/{id}/edit
 *    S-05-01	アカウント一覧画面        /app/account
 *    S-05-02	アカウント登録画面        /app/account/new
 *    S-05-03	アカウント詳細画面        /app/account/{id}
 *    S-05-04	アカウント編集画面        /app/account/{id}/edit
 *    S-06-01	サーバーリソース監視画面  /app/develop/resource
 *    S-07-01	環境設定画面             /app/setting
 */
export default [
    {
        id: "S-00-01",
        name: "ログイン",
        path: "/login",
        element: <Login />
    },
    {
        id: "app",
        path: "/app/*",
        children: [
            {
                id: "S-01-01",
                name: "エントランス",
                path: "/",
                element: <Entrance />
            },
            {
                id: "S-03-01",
                name: "活動日カレンダー",
                path: "calendar",
                element: <Calendar />
            },
            {
                id: "S-03-02",
                name: "活動日カレンダー設定",
                path: "calendar/setting",
                element: <CalendarSetting />
            },
        ]
    }
];

