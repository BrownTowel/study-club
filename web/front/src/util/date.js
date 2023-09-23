import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
// import { ja } from "date-fns/locale";

/** TIMEZONE */
const TIMEZONE_JST = "Asia/Tokyo";
/** FORMAT */
const FORMAT_DBSTRING = "yyyyMMddHHmmss";
const FORMAT_DISPLAY = "yyyy/MM/dd hh:mm:ss";


export const formatString = (d, f) => {

    return format(d, f);
};

/**
 * 
 * @returns Date
 */
// const utc_to_zoned_time_JST = ()  => {
export const utc_to_zoned_time_JST = ()  => {

    return utcToZonedTime(
        new Date(),
        TIMEZONE_JST
    );
}

/**
 * @returns Date
 */
export const get_current_datetime = ()  => {

    return datetime_string_to_date( get_current_datetime_string() );
};

/**
 * @returns string | FORMAT_DBSTRING
 */
export const get_current_datetime_string = ()  => {

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
export const datetime_string_to_date = ( datetime )  => {

    const [
        year,
        month,
        date,
        hours,
        minutes,
        seconds
    ] = [
        datetime.slice(0, 4) || "1970",
        datetime.slice(4, 6) || "01",
        datetime.slice(6, 8) || "01",
        datetime.slice(8, 10) || "00",
        datetime.slice(10, 12) || "00",
        datetime.slice(12, 14) || "00"
    ]
    .map(Number);

    const unix_epoch = ( Date.UTC( year, ( month - 1 ), date, hours, minutes, seconds ) );
    const jst_offset_milisecond = ( ( new Date().getTimezoneOffset() + ( 9 * 60 ) ) * 60 * 1000 );

    return new Date( unix_epoch + jst_offset_milisecond );
};


/**
 * @returns string | FORMAT_DISPLAY
 */
export const get_current_datetime_display = () => {

    return format( utc_to_zoned_time_JST(), FORMAT_DISPLAY );
};

/**
 * 現在月が過去月の場合は真、そうでない場合は偽.
 *  
 * @param string yyyyMM
 *
 * @returns boolean
 */
export const is_past_month = yyyyMM => {

    const now_yyyymm_number = parseInt( formatString( utc_to_zoned_time_JST(), "yyyyMM" ), 10 );
    const yyyyMM_number = parseInt( yyyyMM, 10 );

    return now_yyyymm_number > yyyyMM_number;
}