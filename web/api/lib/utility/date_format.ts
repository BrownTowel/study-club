import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

/** TIMEZONE */
const TIMEZONE_JST = "Asia/Tokyo";
/** FORMAT */
const FORMAT_DBSTRING = "yyyyMMddHHmmss";
const FORMAT_DISPLAY = "yyyy/MM/dd hh:mm:ss";

/**
 * wslの時刻ずれの修正
 * https://qiita.com/moriai/items/f633e01728d8d062adb1
 * 
 */

/**
 * 
 * @returns Date
 */
const utc_to_zoned_time_JST = (): Date => {

    return utcToZonedTime(
        new Date(),
        TIMEZONE_JST
    );
}

/**
 * @returns Date
 */
export const get_current_datetime = (): Date => {

    return datetime_string_to_date( get_current_datetime_string() );
};

/**
 * @returns string | FORMAT_DBSTRING
 */
export const get_current_datetime_string = (): string => {

    return format( utc_to_zoned_time_JST(), FORMAT_DBSTRING );
};

/**
 * 日時文字列からUNIXエポックタイム（ミリ秒）を取得.
 * DateオブジェクトのUTCとのズレを分単位で取得.
 * UTCで動作している場合は0分, JSTで動作している場合は-540分の補正を行いミリ秒からDateオブジェクト生成して返す.
 *
 * @param datetime string
 *
 * @returns Date
 */
export const datetime_string_to_date = ( datetime: string ): Date => {

    const [
        year,
        month,
        date,
        hours,
        minutes,
        seconds
    ]: number[] = [
        datetime.slice( 0, 4 ) || "1970",
        datetime.slice( 4, 6 ) || "01",
        datetime.slice( 6, 8 ) || "01",
        datetime.slice( 8, 10 ) || "00",
        datetime.slice( 10, 12 ) || "00",
        datetime.slice( 12, 14 ) || "00"
    ]
    .map( Number );

    const unix_epoch: number = ( Date.UTC( year, ( month - 1 ), date, hours, minutes, seconds ) );
    const jst_offset_milisecond: number = ( ( new Date().getTimezoneOffset() + ( 9 * 60 ) ) * 60 * 1000 );

    return new Date( unix_epoch + jst_offset_milisecond );
};


/**
 * @returns string | FORMAT_DISPLAY
 */
export const get_current_datetime_display = (): string => {

    return format( utc_to_zoned_time_JST(), FORMAT_DISPLAY );
};
