export type CalendarError = {
    message: string;
}

export type CalendarResponse = {
    data: object | undefined;
    error?: CalendarError;
}

export interface ResultQuery {
    calendar_id: number;
    calendar_title: string;
    calendar_status: string;
    answer_format_class: string;
    calendar_create_account_id: number;
    calendar_create_timestamp: string;
    calendar_update_account_id: number;
    calendar_update_timestamp: string;
    calendar_detail: string;
}

export interface ResultCalendar {
    calendar_id: number;
    calendar_title: string;
    calendar_status: string;
    answer_format_class: string;
    calendar_create_account_id: number;
    calendar_create_timestamp: string;
    calendar_update_account_id: number;
    calendar_update_timestamp: string;
    calendar_detail: ResultCalendarDetail[];
}

export interface ResultCalendarDetail {
    calendar_detail_id: number;
    calendar_detail_day: string;
    calendar_detail_status: string;
    calendar_detail_title: string;
    calendar_detail_comment: string;
    calendar_detail_create_account_id: number;
    calendar_detail_create_timestamp: string;
    calendar_detail_update_account_id: number;
    calendar_detail_update_timestamp: string;
    activity_request: ResultActivityRequest[];
}

export interface ResultActivityRequest {
    activity_request_id: number;
    activity_request_answer_class: string,
    activity_request_comment: string;
    activity_request_create_account_id: number;
    activity_request_create_timestamp: string;
    activity_request_update_account_id: number;
    activity_request_update_timestamp: string;
    activity_request_account_display_name: string;
}

export interface UpsertCalendarData {
    calendarId: number;
    day: string;
    title: string;
    comment: string;
    isEaseEditRestrictions: boolean;
    activityClass: string;
    createAccountId: number;
    updateAccountId: number;
};
