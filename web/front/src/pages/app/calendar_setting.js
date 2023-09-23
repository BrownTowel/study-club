import React, { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { client } from '../../provider/axios';
// import { client } from '../../common/axios';
import { CALENDAR, AUTHORITY, CALENDAR_DETAIL, ACTIVITY_REQUEST } from '../../common/const';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { is_past_month } from '../../util/date';
import { ToggleButtonGroup, ToggleButton, Stack, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useForm } from 'react-hook-form';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

/**
 * 日付情報から選択月のデフォルトの候補日を抽出する.
 *
 * @param Date d
 * 
 * @return string[] 
 */
const get_default_selected_days = d => {

  const default_selected_days = [];

  if ( is_past_month( d.format( "YYYYMM" ) ) ) {
    /** 過去月である. */
    return default_selected_days;
  }
  /**
   * @var date                   Date    検査用日付オブジェクト（ 初期値: 1日 ）
   * @var month_of_days_count    number  選択月の日数（ 初期値: 選択月の最終日（数値））
   * @var default_selected_days  Array   候補日格納用配列
   * @var default_selected_day   string  候補日
   */
  let date = d.date(1);
  let month_of_days_count = parseInt( d.endOf("month").format("DD"), 10 );

  const SUNDAY = '0';
  const SATURDAY = '6';

  while ( month_of_days_count-- ) {

    if (
      date.format('d') === SUNDAY ||
      date.format('d') === SATURDAY
    ) {

      const default_selected_day = date.format("DD");

      if ( ! default_selected_days.includes( default_selected_day ) ) {

        default_selected_days.push( default_selected_day );
      }
    }

    date = date.add( 1, 'd' );
  }

  return default_selected_days;
}

/**
 * @param {string} year
 * @param {string} month
 * 
 * @returns Array
 */
const searchCalendar = async ( year, month ) => {

  try {

    const res = await client.get(`/api/calendar/${year}/${month}`);

    return res.data.data;

  } catch ( e ) {

    return {}
  }
}

export const CalendarSetting = () => {
  /** handler */
  const dayClickHandler = (e, dd) => {

    const days = structuredClone( selectedDays );

    const index = days.indexOf( dd );

    index === -1 ?
      days.push( dd ) :
      days.splice( index, 1 );

    // index === -1 ?
      // e.target.onmouseover = function() {

      //   console.log(`@ `, this)

      //   this.style.backgroundColor = `orange`;
      // }

    // if ( index === -1 ) {

    //   e.target.onmouseover = function() {

    //     console.log(`@ `, this)

    //     this.style.backgroundColor = `orange`;
    //   }
    // } else {

    //   e.target.onmouseover = null;
    // }

    console.log(e)

    setSelectedDays( days );
  };
  /** 設定ボタン */
  const setting_button_handler = async () => {

    let year, month;

    if ( ! currentCalendar.calendar_title ) {

      year = nullInsteadCalendarTitle.slice(0, 4);
      month = nullInsteadCalendarTitle.slice(4, 6);
    } else {

      year = currentCalendar.calendar_title.slice(0, 4);
      month = currentCalendar.calendar_title.slice(4, 6);
    }

    const body = {
      is_register: false,
      answer_format_class: answerFormatClass,
      calendar_detail_days: selectedDays
    };

    const res = await client.post(`/api/calendar/${year}/${month}/setting`, body);


    console.log(res)

  }
  /** 確定テーブル */
  const CalendarDetailTable = props => {

    const { title, currentCalendarDetail } = props;

    if ( !currentCalendarDetail || !title ) {

      return ( <></> );
    }


    const yyyy = title.slice(0, 4);
    const mm = title.slice(4, 6);

    const answer_class = activity_request => {

      if ( !activity_request ) {

        return ACTIVITY_REQUEST.ANSWER_CLASS.TRIANGLE;
      }

      const account_request = activity_request.find( v => v.activity_request_update_account_id === user.id );

      return account_request ?
              account_request.activity_request_answer_class :
              ACTIVITY_REQUEST.ANSWER_CLASS.TRIANGLE;
    }

    /*
    const radio_group_display = ["〇", "△", "×"].reduce( (p, c , i) => {

      p[ c ] = Object.values( ACTIVITY_REQUEST.ANSWER_CLASS )[ i ];

      return p;
    }, {} );
    */


    return (
      <TableContainer>
        <FormControl>
          <FormLabel>{ `${ yyyy }/${ mm } 出欠` }</FormLabel>
          <Table stickyHeader sx={{ width: "auto" }} aria-label="activity request table">
            <TableHead>
              <TableRow>{ currentCalendarDetail.map( d => <TableCell align="right" key={ d.calendar_detail_id }>{ d.calendar_detail_day }</TableCell> ) }</TableRow>
            </TableHead>
            <TableBody>
              <TableRow>{ currentCalendarDetail.map( StatusSwithForm ) }</TableRow>
              <TableRow>{ currentCalendarDetail.map( TitleTextField ) }</TableRow>
              <TableRow>{ currentCalendarDetail.map( CommentTextField ) }</TableRow>
              <TableRow>{ currentCalendarDetail.map( IsEaseEditRestrictionsSwithForm ) }</TableRow>
              <TableRow>{ currentCalendarDetail.map( ActivityClassSwithForm ) }</TableRow>
              <TableRow>{ currentCalendarDetail.map( d => <TableCell key={ d.calendar_detail_id } component="th" scope="row"></TableCell> ) }</TableRow>
            </TableBody>
          </Table>
        </FormControl>
      </TableContainer>
    )
  }
  /**
   * 入力フォーム群
   *   StatusSwithForm
   *   TitleTextField
   *   CommentTextField
   *   IsEaseEditRestrictionsSwithForm
   *   ActivityClassSwithForm
   */
  const StatusSwithForm = ( detail, index, array ) => {

    const [ checked, setChecked ] = React.useState( detail.calendar_detail_status === CALENDAR_DETAIL.STATUS.CANDIDATE );

    const onChangeHandler = e => {

      array[ index ].calendar_detail_status = e.target.checked ? CALENDAR_DETAIL.STATUS.CANDIDATE : CALENDAR_DETAIL.STATUS.EXPECT;

      setFormCalendarDetail( array );
      setChecked( e.target.checked );


      return true;
    }

    return (
      <TableCell key={ detail.calendar_detail_id } component="td" scope="row">
        <FormGroup>
          <FormControlLabel control={ <Switch checked={ checked } onChange={ onChangeHandler } /> } label="確定" labelPlacement="top" />
        </FormGroup>
      </TableCell>
    )
  }

  const TitleTextField = ( detail, index, array ) => {

    const [ value, setValue ] = React.useState( detail.calendar_detail_title );

    const onChangeHandler = e => {

      array[ index ].calendar_detail_title = e.target.value;

      setFormCalendarDetail( array );
      setValue( e.target.value );


      return true;
    }

    return (
      <TableCell key={ detail.calendar_detail_id } component="td" scope="row">
        <TextField label={ `Title` } value={ value } onInput={ onChangeHandler }></TextField>
      </TableCell>
    )
  }


  const CommentTextField = ( detail, index, array ) => {

    const [ value, setValue ] = React.useState( detail.calendar_detail_comment );

    const onChangeHandler = e => {

      array[ index ].calendar_detail_comment = e.target.value;

      setFormCalendarDetail( array );
      setValue( e.target.value );


      return true;
    }

    return (
      <TableCell key={ detail.calendar_detail_id } component="td" scope="row">
        <TextField label={ `Comment` } value={ value } onInput={ onChangeHandler }></TextField>
      </TableCell>
    )
  }

  const IsEaseEditRestrictionsSwithForm = ( detail, index, array ) => {

    const [ checked, setChecked ] = React.useState( detail.calendar_detail_is_ease_edit_restrictions === 1 );

    const onChangeHandler = e => {

      array[ index ].calendar_detail_is_ease_edit_restrictions = Number( e.target.checked );

      setFormCalendarDetail( array );
      setChecked( e.target.checked );


      return true;
    }

    return (
      <TableCell key={ detail.calendar_detail_id } component="td" scope="row">
        <FormGroup>
          <FormControlLabel control={ <Switch checked={ checked } onChange={ onChangeHandler } /> } label="編集制限緩和" labelPlacement="top" />
        </FormGroup>
      </TableCell>
    )
  }

  const ActivityClassSwithForm = ( detail, index, array ) => {

    const [ checked, setChecked ] = React.useState( detail.calendar_detail_activity_class === CALENDAR_DETAIL.ACTIVITY_CLASS.NOT_ONLY_ONLINE );

    const onChangeHandler = e => {

      array[ index ].calendar_detail_activity_class = e.target.checked ? CALENDAR_DETAIL.ACTIVITY_CLASS.NOT_ONLY_ONLINE : CALENDAR_DETAIL.ACTIVITY_CLASS.ONLINE;

      setFormCalendarDetail( array );
      setChecked( e.target.checked );


      return true;
    }

    return (
      <TableCell key={ detail.calendar_detail_id } component="td" scope="row">
        <FormGroup>
          <FormControlLabel control={ 
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{ CALENDAR_DETAIL.ACTIVITY_CLASS_ONLINE }</Typography>
              <Switch checked={ checked } onChange={ onChangeHandler } />
              <Typography>{ CALENDAR_DETAIL.ACTIVITY_CLASS_NOT_ONLY_ONLINE }</Typography>
            </Stack>
            } label="活動区分" labelPlacement="top" />
        </FormGroup>
      </TableCell>
    )
  }
  /** 入力フォーム群 END */

  /** 確定ボタン */
  const register_button_handler = () => {

    console.log(`register_button_handler`);

    console.log( formCalendarDetail );
  }
  /** slots.day */
  const Day = props => {

    const { currentCalendar = [], day, selectedDay, ...other } = props;

    // console.log(other)

    // const yyyymm = day.format("YYYYMM");

    // if ( yyyymm !== currentCalendar.calendar_title ) {

    //   return <PickersDay day={day} {...other} />;
    // }

    // const days = currentCalendar.calendar_detail;

    // if (!days) {

    //   return <PickersDay day={day} {...other} />;
    // }

    // const day_detail = days.find( d => d.calendar_detail_day === day.format("DD") );

    // if (!day_detail) {

    //   return <PickersDay day={day} {...other} />;
    // }

    const dd = day.format("DD");

    const yyyymm = day.format("YYYYMM");

    if ( yyyymm === currentCalendar.calendar_title ) {

      const days = currentCalendar.calendar_detail;

      if ( days ) {

        const day_detail = days.find( d => d.calendar_detail_day === day.format("DD") );

        if ( day_detail ) {

          const badgeRef = React.createRef();

          return (
            <PickersDay
              day={ day }
              sx={ { bgcolor: isSelected( dd ) ? `orange` : `white` } }
              onClick={ e => dayClickHandler( e, dd ) }
              onDaySelect={ () => {} }
              onBlur={ () => {} }
              onFocus={ () => {} }
              onKeyDown={ () => {} }
              outsideCurrentMonth={ false }
              {...other}
            >{ dd }
              <Tooltip
                title={
                  day_detail.activity_request.map( ar => {

                    return <div key={ ar.activity_request_id }>{ ar.activity_request_account_display_name }</div>
                  })
                }
              >
                <Badge
                  ref={ badgeRef }
                  overlap="circular"
                ><AccountCircleIcon />
                </Badge>
              </Tooltip>
            </PickersDay>
          );
      
        }
      }
    }


    return (
      <PickersDay
        day={ day }
        sx={{ bgcolor: isSelected( dd ) ? `orange` : `white` }}
        onClick={ e => dayClickHandler( e, dd ) }
        onDaySelect={ () => {} }
        onBlur={ () => {} }
        onFocus={ () => {} }
        onKeyDown={ () => {} }
        outsideCurrentMonth={ false }
        {...other}
      />
    );
  }
  /** onMonthChange */
  const monthChange = async e => {

    console.log(`monthChange`)

    setSelectedDays([]);

    const key = e.format("YYYYMM");

    if ( calendars[key] ) {

      if ( calendars[key].calendar_status === CALENDAR.STATUS.COMFIRM ) {

        /** カレンダーステータス確定時 */
      }

      setCurrentCalendar( calendars[key] );

      const _currentCalendarDetail = structuredClone( calendars[key].calendar_detail ).sort( ( a, b ) => a.calendar_detail_day < b.calendar_detail_day ? -1 : 1 );
      setFormCalendarDetail( _currentCalendarDetail );

      return
    }

    const year = e.format("YYYY");
    const month = e.format("MM");

    const ret = await searchCalendar( year, month );


    if ( !ret.calendar_detail ) {
      /** 未設定 */
      setSelectedDays( get_default_selected_days( e ) );  
      setCurrentCalendar( {} );

      setFormCalendarDetail( [] );

      setNullInsteadCalendarTitle( key );

      return
    }

    calendars[ ret.calendar_title ] = ret;

    setCalendar( calendars );

    const current_selected_days = [];

    ret.calendar_detail.forEach( detail => {

      current_selected_days.push( detail.calendar_detail_day );
    });

    setSelectedDays( current_selected_days );
    setCurrentCalendar( ret );

    const _currentCalendarDetail = structuredClone( ret.calendar_detail ).sort( ( a, b ) => a.calendar_detail_day < b.calendar_detail_day ? -1 : 1 );
    setFormCalendarDetail( _currentCalendarDetail );

    if ( ret.calendar_status === CALENDAR.STATUS.COMFIRM ) {

      /** カレンダーステータス確定時 */
    }
  };
  /** 算出 */
  const isSelected = day => selectedDays.includes( day );
  const is_setting_button_disabled = calendar => {

    if ( ! calendar.calendar_status && ! selectedDays.length ) {
      /** 未設定かつ候補日未選択 || 過去月である. */
      return true;
    }

    if ( calendar.calendar_status !== CALENDAR.STATUS.COMFIRM ) {
      /** 未設定 検討中 */
      return false;
    }

    /** 確定 運営者のみ false を返す. */
    return user.class === AUTHORITY.CLASS.ADMIN ? false : true;
  }
  const is_register_button_disabled = calendar => {

    /**
     * @todo
     * 活動要望データが存在する場合の活動候補日・活動予定日の削除について
     */
    if ( ! calendar.calendar_status ) {
      /** 未設定 || 過去月である. */
      return true;
    }

    if ( calendar.calendar_status !== CALENDAR.STATUS.COMFIRM ) {
      /** 検討中 */
      return false;
    }

    /** 確定 運営者のみ false を返す. */
    return user.class === AUTHORITY.CLASS.ADMIN ? false : true;
  }

  const [ calendars, setCalendar ] = React.useState( [] );
  const [ currentCalendar, setCurrentCalendar ] = React.useState( {} );
  const [ selectedDays, setSelectedDays ] = React.useState( [] );
  const [ nullInsteadCalendarTitle, setNullInsteadCalendarTitle ] = React.useState( "" );
  const [ answerFormatClass, setAnswerFormatClass ] = React.useState( "01" );
  const [ formCalendarDetail, setFormCalendarDetail ] = React.useState( [] );

  // const customButtonGroup = { display: "flex", justifyContent: "flex-end" };

  const user = useSelector(state => state.account.user);

  const { register, handleSubmit } = useForm();

  const radio_group_name = `radio-group`;

  useEffect(() => {

    monthChange( dayjs() );

  }, []);

  return (
    <>
      <style>{`
        div.MuiDateCalendar-root .MuiDateCalendar-viewTransitionContainer .MuiPickersDay-root.Mui-selected {
          background-color: orange;
        }
        div.MuiDateCalendar-root div.MuiPickersFadeTransitionGroup-root div.MuiPickersSlideTransition-root {
          min-height: auto;
        }
        div.MuiDateCalendar-root div.MuiPickersFadeTransitionGroup-root div.MuiPickersSlideTransition-root div.MuiDayCalendar-monthContainer {
          position: relative;
        }
      `}</style>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <h2>Calendar Setting</h2>
        <DateCalendar
          slots={{ day: Day }}
          slotProps={{ day: { currentCalendar } }}
          onMonthChange={ monthChange }
        />
        <Box
          component="form"
          onSubmit={ handleSubmit( register_button_handler ) }
          sx={{ pl: 2.25 }}
        >
          <Grid container sx={{ mt: 4 }}>

            <Grid xs={1}></Grid>
              <Grid xs={10}>
                  <CalendarDetailTable
                    title={ currentCalendar.calendar_title }
                    currentCalendarDetail={ formCalendarDetail }
                  />
              </Grid>
            <Grid xs={1}></Grid>

            <Grid xs={1}></Grid>
            <Grid xs={10}>
              {/* button */}
              <Box sx={{ pl: 2.25 }}>
                <Grid container sx={{ mt: 4 }}>
                  <Grid xs={ 8 }></Grid>
                  <Grid xs={ 2 } sx={{ textAlign: `right` }}>
                    <ToggleButtonGroup
                      color="primary"
                      value={ answerFormatClass }
                      size="small"
                      exclusive
                      disabled={ (() => {
                        /** @TODO カレンダーステータスで判定 */
                        return false
                      })() }
                      onChange={ () => setAnswerFormatClass(
                                          answerFormatClass === CALENDAR.ANSWER_FORMAT_CLASS.SIGNED ?
                                            CALENDAR.ANSWER_FORMAT_CLASS.SECRET :
                                            CALENDAR.ANSWER_FORMAT_CLASS.SIGNED
                                      ) }
                    >
                      <ToggleButton value={ CALENDAR.ANSWER_FORMAT_CLASS.SIGNED }>記名回答</ToggleButton>
                      <ToggleButton value={ CALENDAR.ANSWER_FORMAT_CLASS.SECRET }>匿名回答</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid xs={ 2 } sx={{ textAlign: `right` }}>
                    <Button
                      sx={{ mr: 2.25 }}
                      variant="outlined"
                      color="primary"
                      type="submit"
                      onClick={ () => setting_button_handler() }
                      disabled={ is_setting_button_disabled( currentCalendar ) }
                    >設定</Button>
                    <Button
                      sx={{ mr: 2.25 }}
                      variant="outlined"
                      color="primary"
                      onClick={ () => register_button_handler( false ) }
                      disabled={ is_register_button_disabled( currentCalendar ) }
                    >確定</Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid xs={ 1 }></Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
      <pre>{ JSON.stringify( selectedDays, null, "\t" ) }</pre>
      <pre>{ JSON.stringify( formCalendarDetail, null, "\t" ) }</pre>
    </>
  );
};
