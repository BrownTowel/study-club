/**
 * 権限情報を元にルーティング定義情報から認可ルートのみを抽出して返却する.
 * 
 * @param array routes ルーティング定義情報 /src/routes.js
 * @param object permissions 権限情報
 * 
 * @returns array authorize_routes 認可ルート
 */
export const authorize_routes = ( routes, permissions ) => {

    return routes.filter(
        route => permissions[ route.id ] ?
            permissions[ route.id ].length ?
                route :
                false :
            false
    );
};
