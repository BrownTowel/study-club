import fs from 'fs'

const encoding: BufferEncoding = "utf8";

export const read = ( file: string ): string => {

    return fs.existsSync( file ) ? fs.readFileSync( file, encoding ) : '';
}

export const readJson = ( file: string ): any => {

    return JSON.parse(
        fs.existsSync( file ) ?
            fs.readFileSync( file, encoding ) :
            `{}`
    );
}

/**
 * 上書き処理.
 *
 * @param path 
 * @param content 
 */
export const write = function( file: string, data: string ): boolean {

    try {

        fs.writeFileSync( file, data );
    } catch ( e: any ) {

        return false;
    }

    return true;
}
