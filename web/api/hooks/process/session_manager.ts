import { datetime_string_to_date, get_current_datetime, get_current_datetime_display, get_current_datetime_string  } from "@/lib/utility/date_format";
import type { Account, Session } from "@/lib/types/globals"
import { write, readJson } from "@/lib/utility/file_system";


export const session_manager = function ( id: string, token: string, account: Account ): Session {

    const session_expire_minutes: number = get_session_expire_minutes();

    const loginDatetime = datetime_string_to_date( account.loginDatetime );
    // const loginDatetime = datetime_string_to_date( "19701010000000" );

    loginDatetime.setMinutes( loginDatetime.getMinutes() + session_expire_minutes );
    // loginDatetime.setMinutes(loginDatetime.getMinutes() - 3);

    const session: Session = {
        id: id,
        account_id: account.id,
        address: account.address,
        registerName: account.registerName,
        displayName: account.displayName,
        class: account.class,
        loginDatetime: account.loginDatetime,
        videoConnectionDatetime: account.videoConnectionDatetime,
        expire_datetime: loginDatetime,
        is_expire: true,
        token: token
    };

    const behavior = {

        get(
            obj: Session,
            prop: keyof typeof session
        ): string | number | Date | boolean | null | undefined {

            if ( prop in obj === false ) {

                return undefined;
            }

            if ( prop === "is_expire" ) {

                return ( get_current_datetime().getTime() < obj.expire_datetime.getTime() )
            }

            /**
             * https://qiita.com/hisashisatake@github/items/0ed17b1f6b2c0108be59
             */
            return obj[ prop ];
        },

        set(
            obj: Session,
            prop: keyof typeof session,
            value: string | number | Date | boolean
        ): boolean {

            const notAssignmentProperties = [
                "id",
                "account_id",
                // "expire_datetime",
                "is_expire",
                "token"
            ];


            if ( notAssignmentProperties.includes( prop ) ) {

                return false;
            }

            if ( prop === "expire_datetime" ) {

                obj[ prop ] = value as Date;

                return true;
            }

            if ( typeof value !== "string" ) {

                return false;
            }

            obj[ prop as
                    "address" |
                    "registerName" |
                    "displayName" |
                    "class" |
                    "loginDatetime" |
                    "videoConnectionDatetime"
            ] = value as string;


            return true;
        }
    };

    return new Proxy(session, behavior);   
}


const get_session_expire_minutes = (): number => {

    return process.env.SESSION_EXPIRE_MINUTES ?
                parseInt( process.env.SESSION_EXPIRE_MINUTES, 10 ) :
                1440;
}


export const update_session = ( session_id: string ): boolean => {

    for ( const idx in globalThis.SESSION ) {

        if ( globalThis.SESSION[ idx ].id !== session_id ) {

            continue;
        }
        
        const updated_expire_datetime = ( datetime_string_to_date( get_current_datetime_string() ) );

        updated_expire_datetime.setMinutes( updated_expire_datetime.getMinutes() + get_session_expire_minutes() );

        globalThis.SESSION[ idx ].expire_datetime = updated_expire_datetime;

        return true;
    }

    // globalThis.SESSION.forEach( v => {

    //     if ( v.id !== session_id ) {

    //         return
    //     }

    //     const updated_expire_datetime = ( datetime_string_to_date( get_current_datetime_string() ) );

    //     updated_expire_datetime.setMinutes( updated_expire_datetime.getMinutes() + get_session_expire_minutes() );

    //     v.expire_datetime = updated_expire_datetime;
    // } );

    return false;
}


export const session_clear = ( id: number, sessions: Session[] ): boolean => {

    while ( true ) {

        const index = sessions.findIndex( s => s.account_id === id || !s.is_expire );

        if ( index === -1 ) {

            break;
        }

        sessions.splice(index, 1);
    }

    return true;
}

export const session_write_file = ( sessions: Session[] ): boolean => {

    try {
        
        const session_file_path = process.env.SESSION_FILE_PATH;

        if (!session_file_path) {

            throw new Error(`Environment variables 'SESSION_FILE PATH' must be set of environment file.`);
        }

        const ret = write( session_file_path, JSON.stringify( sessions ) );

        if ( !ret ) {

            throw new Error(`Error session.json write failed.`)
        }

    } catch (e: any) {

        console.log(`${e.name} ${ get_current_datetime_display() } ${e.message}`);

        return false;
    }

    return true;
}

export const session_read_file = (): Session[] => {

    let sessions: Session[] = [];

    try {

        const session_file_path = process.env.SESSION_FILE_PATH;

        if (!session_file_path) {

            throw new Error(`Environment variables 'SESSION_FILE PATH' must be set of environment file.`);
        }

        sessions = readJson( session_file_path );

    } catch (e: any) {

        console.log(`${e.name} ${ get_current_datetime_display() } ${e.message}`);
    }

    return sessions;
}
