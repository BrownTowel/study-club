import crypto from 'crypto';

const algorithm = `aes-256-cbc`;
const password = process.env.NEXTAUTH_SECRET ?? ``;
const salt = process.env.NEXTAUTH_SECRET ?? ``;
const keylen = 32;

/**
 * 平文文字列を暗号化文字列に変換して返す.
 * 暗号化文字列は初期化ベクトルとAES暗号化した平文文字列をオブジェクトに変換してJSON文字列にエンコードした後にBASE64エンコードして生成する.
 * 
 * @todo エラーハンドル.
 * @todo 初期化ベクトルは都度生成しなくても固定値にして外に出してもいい.
 * 
 * @param plain_text 平文文字列
 *
 * @returns string 暗号化文字列
 */
export const encode = ( plain_text: string ) : string => {
    /**
     * 鍵作成.
     */
    const key = crypto.scryptSync( password, salt, keylen );
    /**
     * 初期化ベクトル生成.
     */
    const iv = crypto.randomBytes( 16 );
    /**
     * 暗号器生成
     */
    const cipher = crypto.createCipheriv( algorithm, key, iv );
    /**
     * 暗号処理.
     */
    const encryptedData = Buffer.concat([
        cipher.update( Buffer.from( plain_text ) ),
        cipher.final()
    ]);


    return btoa( JSON.stringify( { iv, encryptedData } ) );
}

/**
 * 暗号化文字列を平文文字列(UTF-8)に変換して返す.
 * 暗号化文字列はBASE64デコードしてJSON文字列からオブジェクトにパース処理を行い、初期化ベクトルとAES暗号化文字列を取り出す.
 * 
 * @todo エラーハンドル.
 *
 * @param encoded_text 暗号化文字列
 *
 * @returns string 平文文字列
 */
export const decode = ( encoded_text: string ) : string => {
    /**
     * 初期化ベクトルとAES暗号化文字列を取得.
     */
    const { iv, encryptedData } = JSON.parse( atob( encoded_text ) );
    /**
     * 鍵作成.
     */
    const key = crypto.scryptSync( password, salt, keylen );
    /**
     * 復号器生成
     */
    const decipher = crypto.createDecipheriv( algorithm, key, Buffer.from( iv.data ) );
    /**
     * 復号処理.
     */
    const decryptedData = Buffer.concat([
        decipher.update( Buffer.from( encryptedData.data ) ),
        decipher.final()
    ]);


    return decryptedData.toString("utf-8");
}

/** 確認用
 * import { encode, decode } from '@/lib/utility/crypto';
 *
 * return res.status( constHttp.OK.code ).json({ data: { encode: encode(`I love you`), decode: decode( encode(`I love you`) ) } });
 */