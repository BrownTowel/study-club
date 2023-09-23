import jwt from 'jsonwebtoken';
import { Account } from '@/lib/types/globals';
import { read } from "@/lib/utility/file_system";

const public_key = read( process.env.JWE_PUBLIC_KEY ?? "" );
const private_key = read( process.env.JWE_PRIVATE_KEY ?? "" );

export const json_web_token = ( payload: Account ): string => {

    return jwt.sign( payload, private_key, { algorithm: 'RS256' } );
}

export const decoded_json_web_token = ( token: string ): jwt.JwtPayload => {

    return jwt.verify(token, public_key, { algorithms: ['RS256'] }) as jwt.JwtPayload;
}
