import type { ScreenPermission } from '../globals';

export type CredentialError = {
    message: string;
}

export type CredentialResponse = {
    credential: Credential | undefined | null;
    error?: CredentialError;
}

export type Credential = {
    account: object;
    token: string;
    permissions: ScreenPermission;
}

export interface JWTPayload {
    id: number;
    sessionId: string,
    address: string;
    registerName: string;
    displayName: string;
    class: string;
    loginDatetime: string;
    videoConnectionDatetime: string | null;
}

export type AccountResponse = {
    account: Account | undefined | null;
    error?: AccountError;
}

export type AccountError = {
    message: string;
}

export type Account = {
    user: User;
    permissions: ScreenPermission;
}

export type User = {
    id: number;
    address: string;
    registerName: string;
    displayName: string;
    class: string;
}

/**
 * 検証可否
 *      true: 合格, false: 不合格
 * 有効期間可否
 *      true: 有効, false: 無効
 * アカウントID 
 */
export type Verification = [
    boolean,
    boolean,
    number | null
]
