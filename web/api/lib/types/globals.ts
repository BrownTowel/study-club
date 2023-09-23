/** permission */
export interface GlobalPermission {
    [ key: string ]: ScreenPermission
}

// export interface AccountPermission {
//     [ key: string ]: ScreenPermission;
// }

export interface ScreenPermission {
    [ key: string ]: string[];
}

// export interface ScreenPermission {
//     [ key: string ]: string[];
// }

/** session */
export interface Account {
    id: number;
    address: string;
    registerName: string;
    displayName: string;
    class: string;
    loginDatetime: string;
    videoConnectionDatetime: string | null;
}

export interface Session {
    id: string;
    account_id: number;
    address: string;
    registerName: string;
    displayName: string;
    class: string;
    loginDatetime: string;
    videoConnectionDatetime: string | null;
    expire_datetime: Date;
    is_expire: boolean;
    token: string;
}

export interface PublicPage {
    id: number;
    title: string;
    description: string;
    publishStartDatetime: string;
    publishEndDatetime: string;
    url: string;
    content: string;
}
