interface constHttp {
    code: number,
    message: string
}

namespace http {
    export const OK : constHttp = { code: 200, message: 'OK' };
    export const CREATED : constHttp = { code: 201, message: 'Created' };
    export const NO_CONTENT : constHttp = { code: 204, message: 'No Content' };
    export const BAD_REQUEST : constHttp = { code: 400, message: "Bad Request" };
    export const EXPIRED_TOKEN : constHttp = { code: 400, message: "Invalid Request expired token" };
    export const UNAUTHORIZED : constHttp = { code: 401, message: "Unauthorized" };
    export const FORBIDDEN : constHttp = { code: 403, message: "Forbidden" };
    export const METHOD_NOT_ALLOWED : constHttp = { code: 405, message: "Method Not Allowed" };
    export const INTERNAL_SERVER_ERROR : constHttp = { code: 500, message: "Internal Server Error" };
}

export { http }
