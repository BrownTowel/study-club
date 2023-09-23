import {
    GlobalPermission,
    ScreenPermission
} from '@/lib/types/globals';

/** 不要 */
export const get_account_JSON = () :string => {

    return JSON.stringify( (( permission_info ):GlobalPermission => {

        const ACCOUNT_PERMISSION: GlobalPermission = {};

        for (const info of permission_info) {

            const SCREEN_PERMISSION: ScreenPermission = {};

            for (const permission of info.permissions) {

                SCREEN_PERMISSION[ permission.screen_id ] = permission.permission;
            }

            ACCOUNT_PERMISSION[ info.class ] = SCREEN_PERMISSION;
        }


        return ACCOUNT_PERMISSION;

    })( require("@/resources/permission.json").permission_info ) );
}


export const get_permission_info = () : GlobalPermission => {

    const permission_info = require("@/resources/permission.json").permission_info;

    const global_permission: GlobalPermission = {};

    for ( const info of permission_info ) {

        const screen_permission: ScreenPermission = {};

        for (const permission of info.permissions) {

            screen_permission[ permission.screen_id ] = permission.permission;
        }

        global_permission[ info.class ] = screen_permission;
    }

    return global_permission;
}
