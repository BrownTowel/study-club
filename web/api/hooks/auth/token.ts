import type { NextApiRequest } from 'next';
import { decoded_json_web_token } from '@/hooks/process/token';
import { api_permissions, ApiNo, constAPIPermission, ScreenID } from "@/lib/constant/api_permission"
import { ScreenPermission, GlobalPermission, Session } from '@/lib/types/globals';
import { JwtPayload } from 'jsonwebtoken';
import type { Verification } from '@/lib/types/auth/type';
import { update_session } from '@/hooks/process/session_manager';

export const verification = ( req: NextApiRequest, api_no: ApiNo ) : Verification => {

    const authorization: string = req.headers.authorization ?? "";
    const [ _, token ]: string[] = authorization.split(" ");

    if ( ! token || token === `null` ) {

        return [ false, false, null ];
    }

    const payload: JwtPayload = decoded_json_web_token( token );
    const session: Session | undefined = globalThis.SESSION.find( session => session.id === payload.sessionId );


    if ( ! session ) {

        return [ false, false, null ];
    }

    if ( ! session.is_expire ) {

        return [ false, false, null ];
    }

    const api_permission: constAPIPermission | undefined = api_permissions.find( v => v.api_no === api_no );

    if ( ! api_permission ) {

        return [ false, true, null ];
    }

    const screen_id_list: ScreenID[] = api_permission.screen_id_list;
    const operation: 'C' | 'R' | 'U' | 'D' = api_permission.operation;

    const global_permission: GlobalPermission = globalThis.PERMISSION_INFO as GlobalPermission;
    const account_permission: ScreenPermission | undefined = global_permission[ session.class ];

    if ( ! account_permission ) {

        return [ false, true, null ];
    }


    for ( const screen_id of screen_id_list ) {

        if ( screen_id in account_permission === false ) {

            continue;
        }
        
        const screen_permission: string[] = account_permission[ screen_id ];
        
        if ( ! screen_permission ) {

            continue;
        }


        if ( screen_permission.includes( operation ) ) {

            if ( ! update_session( session.id ) ) {

                console.log( `update_session failed [session id: ${ session.id }]` );
            }

            return [ true, true, session.account_id ];
        }
    }


    return [ false, true, null ];
}

/**
{
  '01': {
    'S-01-01': [ 'R', 'C', 'U', 'D' ],
    'S-02-01': [ 'R', 'C', 'U', 'D' ],
    'S-03-01': [ 'R', 'C', 'U', 'D' ],
    'S-03-02': [ 'R', 'C', 'U', 'D' ],
    'S-04-01': [ 'R', 'C', 'U', 'D' ],
    'S-04-02': [ 'R', 'C', 'U', 'D' ],
    'S-04-03': [ 'R', 'C', 'U', 'D' ],
    'S-04-04': [ 'R', 'C', 'U', 'D' ],
    'S-05-01': [ 'R', 'C', 'U', 'D' ],
    'S-05-02': [ 'R', 'C', 'U', 'D' ],
    'S-05-03': [ 'R', 'C', 'U', 'D' ],
    'S-05-04': [ 'R', 'C', 'U', 'D' ],
    'S-06-01': [ 'R', 'C', 'U', 'D' ],
    'S-07-01': [ 'R', 'C', 'U', 'D' ]
  },
  '02': { 'S-03-01': [ 'R', 'C', 'U', 'D' ], 'S-03-02': [] },
  '03': { 'S-01-01': [ 'R' ], 'S-03-01': [] },
  '04': { 'S-01-01': [ 'R' ], 'S-03-01': [] }
}
 */