export type Account = {
    data: ResultNormal[] | undefined
}

export interface ResultNormal {
    id: number;
    display_name: string;
}

export interface ResultQuery {
    id: number;
    address: string;
    register_name: string;
    display_name: string;
    class: string;
    status: string;
    remarks: string;
    login_datetime: string;
    video_connection_datetime: string;
    create_account_id: number;
    create_timestamp: string;
    update_account_id: number;
    update_timestamp: string;
}

export interface Session {
    id: number;
    sessionId: string,
    address: string;
    registerName: string;
    displayName: string;
    class: string;
    loginDatetime: string;
    videoConnectionDatetime: string | null;
    expire_datetime: Date;
}

export interface SessionResponse {
    sessions: Session[];
}
