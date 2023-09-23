import React, { useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
import { client } from '../../provider/axios';
// import { client } from '../../common/axios';
import Grid from '@mui/material/Unstable_Grid2';
import { CALENDAR, AUTHORITY, ACTIVITY_REQUEST } from '../../common/const';
import { useSelector } from 'react-redux';
import { is_past_month } from '../../util/date';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useForm } from 'react-hook-form';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip  from '@mui/material/Tooltip';

const overlay_style = { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const content_style = { zIndex: "2", width: "50%", padding: "1em", background: "#fff" };

const CustomPickersDay = styled( PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

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

const formatDate = datetime => {

  return dayjs(datetime).format("YYYY/MM/DD");
}

/**
 * ID: S-03-01
 * 画面名: 活動日カレンダー画面
 * URL: /app/calendar
 * 
 * 権限			
 *   運営	開発	汎用	一時利用
 *   〇	  〇	  〇	  ×
 *
 * 
 * 状態                  カレンダー表示   	日付ボタン  	    登録ボタン  	設定ボタン    	ステータス  	    備考
 * 初期		                日付のみ	          非活性	        非活性  	     活性   	        -   	      イベント名・候補日・希望日が未設定の状態を初期とする
 * 活動候補日設定済み		   日付と候補日	        活性  	        活性        	活性    	      検討中
 * 活動日登録済み		       日付と活動日	        非活性         非活性 	      非活性           確定         運営者のみ編集可能としないと修正がきかない
 *                                                                   （運営者のみ活性）
 * 活動日登録済み２		     日付と活動日	        非活性          活性          活性             確定         日にち単位の編集可能設定がされているケース
 *                                    （編集可能日のみ活性）
 * 過去月となった場合		   日付と活動日         非活性          非活性        非活性            確定
 * 
 */
export const Calendar = () => {
  /** Modal */
  function Modal( props ) {

    console.log( user.id );

    const [ isAppearRadioGroup, setIsAppearRadioGroup ] = React.useState( false );


    if (!props.show) {
  
      return false;
    }

    if ( !props.data.activity_request ) {

      return false;
    }

    // const is_answered = props.data.activity_request.some( v => v.activity_request_update_account_id === user.id );

    return (
      <Dialog onClose={ () => setIsShowModal(false) } open={ props.show }>
        <DialogTitle>{ formatDate(currentCalendar.calendar_title + props.data.calendar_detail_day) } { props.data.calendar_detail_title }</DialogTitle>
        <DialogContent dividers>
          <List>
            {
              props.data.activity_request.map(v => {

                return (
                  <ListItem  key={ v.activity_request_id }>
                    <span style={{ marginRight: "1em" }}>{ v.activity_request_account_display_name }</span>
                    <span>{ v.activity_request_comment }</span>
                  </ListItem >
                );
              })
            }
          </List>

          <Grid container>
            <Grid xs={3}></Grid>
            <Grid xs={6}>
              <FormGroup>
                <FormControlLabel control={<Switch />} label="回答する" onChange={ e => { setIsAppearRadioGroup( e.target.checked ) } } />
              </FormGroup>
            </Grid>
            <Grid xs={3}></Grid>
          </Grid>

          <Grid container>
            <Grid>
              <FormControl style={ { display: isAppearRadioGroup ? `block` : `none` } }>
                <FormLabel id="demo-radio-buttons-group-label">出欠</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                > 
                  <FormControlLabel control={<Radio />} label="〇" />
                  <FormControlLabel control={<Radio />} label="△" />
                  <FormControlLabel control={<Radio />} label="×" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid>
              <TextField></TextField>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="warning"
            onClick={ () => setIsShowModal(false) }
          >Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  /** 出欠フォームテーブル */
  const ActivityRequestTable = props => {

    const { title, currentCalendarDetail } = props;


    if ( !currentCalendarDetail ) {

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

    const radio_group_display = ["〇", "△", "×"].reduce( (p, c , i) => {

      p[ c ] = Object.values( ACTIVITY_REQUEST.ANSWER_CLASS )[ i ];

      return p;
    }, {} );


    const _currentCalendarDetail = structuredClone( currentCalendarDetail ).sort( ( a, b ) => a.calendar_detail_day < b.calendar_detail_day ? -1 : 1 );


    return (
      <TableContainer>
        <FormControl>
          <FormLabel>{ `${ yyyy }/${ mm } 出欠` }</FormLabel>
          <Table stickyHeader sx={{ width: "auto" }} aria-label="activity request table">
            <TableHead>
              <TableRow>
                {
                  _currentCalendarDetail.map( d =>
                    <TableCell
                      align="right"
                      key={ d.calendar_detail_id }
                    >{ d.calendar_detail_day }</TableCell>
                  )
                }
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
              {
                _currentCalendarDetail.map( detail => (
                  <TableCell key={ detail.calendar_detail_id } component="th" scope="row">
                  {
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={ answer_class( detail.activity_request ) }
                      // name={ `${ radio_group_name }[${detail.calendar_detail_id}]` }
                    >
                    {
                      ( () => {

                        const list = [];

                        for ( const label in radio_group_display ) {
                          list.push(
                            <FormControlLabel
                              key={ radio_group_display[ label ] }
                              value={ radio_group_display[ label ] }
                              control={ <Radio { ...register( `${ radio_group_name }[${ detail.calendar_detail_id }]` ) } /> }
                              label={ label }
                            />)
                        }

                        return list;
                      } )()
                    }
                    </RadioGroup>
                  }
                  </TableCell>
                ))
              }
              </TableRow>
              <TableRow>
                {/* <TableCell component="th" scope="row"><EditNoteIcon /></TableCell> */}
                {
                  _currentCalendarDetail.map( detail => (
                    <TableCell
                      key={ detail.calendar_detail_id }
                      component="th"
                      scope="row"
                    ><CommentModal detail={detail} /></TableCell>
                  ))
                }
              </TableRow>
            </TableBody>
          </Table>
        </FormControl>
      </TableContainer>
    );
  };
  /** コメントモーダル */
  const CommentModal = props => {

    const [ anchorEl, setAnchorEl ] = React.useState( null );
    const input_ref = useRef();

    const tooltip_content = () => {

      return input_ref.current ? input_ref.current.value : ``;
    };
    const on_click_handler = () => {

      console.log( input_ref.current.value );

      setAnchorEl( null );
    };

    return (
      <>
        <Tooltip title={ tooltip_content() } arrow>
          <EditNoteIcon onClick={ e => setAnchorEl( e.currentTarget ) } />
        </Tooltip>
        <Menu
          open={ Boolean( anchorEl ) }
          anchorEl={ anchorEl }
          onClose={ () => { setAnchorEl( null ) } }
        >
          <MenuItem>
            <TextField
              id={ `${ comment_name }[${ props.detail.calendar_detail_id }]` }
              label={ `Comment` }
              inputRef={ input_ref }
              { ...register( `${ comment_name }[${ props.detail.calendar_detail_id }]` ) }
            ></TextField>
          </MenuItem>
          <MenuItem>
            <Button
              variant="contained"
              color="primary"
              onClick={ on_click_handler }
            >save</Button>
          </MenuItem>
        </Menu>
      </>
    )
  }
  /** handler */
  const dayClickHandler = dayEvent => {

    setCalendarDetail(dayEvent);

    setIsShowModal(true);
  };
  /** 設定ボタン */
  const setting_button_handler = () => {
    console.log(`setting_button_handler`);

    /**
     * @todo
     * 状態管理で現在月を保存
     * カレンダー設定画面で遷移前の現在月をデフォルトにする.
     */
  };
  /** 登録ボタン */
  const register_button_handler = async data => {

    console.log(`register_button_handler`);

    data[ radio_group_name ].forEach( v => {
      console.log( v );
    } );

    const activity_days = currentCalendar.calendar_detail.map( v => v.calendar_detail_day );


    console.log(activity_days)

    // const radio_group_values = activity_days.reduce( (p, c , i) => {

    //   p[ c ] = {
    //     answer_class: data[ radio_group_name ][ i + 1 ],
    //     comment: data[ comment_name ][ i + 1 ] ?? null
    //   };

    //   return p;
    // }, {} );

    const body = activity_days.reduce( (p, c , i) => {

      p.push( {
        day: c,
        answer_class: data[ radio_group_name ][ i + 1 ],
        comment: data[ comment_name ][ i + 1 ] ?? null
      } );

      return p;
    }, [] );


    console.log(body)

    const year = currentCalendar.calendar_title.slice(0, 4);
    const month = currentCalendar.calendar_title.slice(4, 6);

    const res = await client.post(`/api/calendar/${year}/${month}`, body);

  };
  /** slots.day */
  const Day = props => {

    // const { calendars = [], day, selectedDay, ...other } = props;
    const { currentCalendar = [], day, selectedDay, ...other } = props;


    const yyyymm = day.format("YYYYMM");

    if ( yyyymm !== currentCalendar.calendar_title ) {

      // if ( is_past_month( currentCalendar.calendar_title ) ) {

      //   return <PickersDay day={day} sx={{ bgcolor: `yellow` }} {...other} />;
      // }

      return <PickersDay day={day} {...other} />;
    }

    // const days = calendars[ yyyymm ];
    const days = currentCalendar.calendar_detail;

    if (!days) {

      return <PickersDay day={day} {...other} />;
    }

    // const day_detail = days[day.format("DD")];
    const day_detail = days.find( d => d.calendar_detail_day === day.format("DD") );

    if (!day_detail) {

      return <PickersDay day={day} {...other} />;
    }

  
    return (
      <CustomPickersDay
        day={ day }
        sx={{ bgcolor: `orange` }}
        onClick={ () => dayClickHandler( day_detail ) }
        selected={ false }
        { ...other }
      />
    );
  };
  /** onMonthChange */
  const monthChange = async e => {

    const key = e.format("YYYYMM");

    setIsEaseEditRestrictions( false );

    if ( calendars[key] ) {

      // setCurrentCalendar( calendars[key].calendar );


      calendars[key].calendar_detail.forEach( r => {
  
        if ( r.calendar_detail_is_ease_edit_restrictions ) {
  
          setIsEaseEditRestrictions( true );
        }
      });

      setCurrentCalendar( calendars[key] );

      return
    }

    const year = e.format("YYYY");
    const month = e.format("MM");

    const ret = await searchCalendar( year, month );


    if ( !ret.calendar_detail ) {

      setCurrentCalendar({});

      return
    }

    // if ( !ret.calendar_detail.length ) {

    //   setCurrentCalendar({});

    //   return
    // }

    console.log("@@@@@@@@@@@@@");
    console.log(ret);



    ret.calendar_detail.forEach( r => {

      if ( r.calendar_detail_is_ease_edit_restrictions ) {

        setIsEaseEditRestrictions( true );
      }
    });


    // calendars[key] = {};

    // setIsEaseEditRestrictions( false );

    // ret.calendar_detail.forEach( r => {

    //   const day = r.calendar_detail_day;

    //   /** currentCalendar情報 */
    //   calendars[key].calendar = {
    //     calendar_id: ret.calendar_id,
    //     calendar_title: ret.calendar_title,
    //     calendar_status: ret.calendar_status,
    //     answer_format_class: ret.answer_format_class         
    //   };

    //   calendars[key][day] = r;

    //   if ( r.calendar_detail_is_ease_edit_restrictions ) {

    //     setIsEaseEditRestrictions( true );
    //   }

    //   calendars[key][day].calendar_month = ret.calendar_title;
    // });

    calendars[ ret.calendar_title ] = ret;

    setCalendar( calendars );


    // setCurrentCalendar( {
    //   calendar_id: ret.calendar_id,
    //   calendar_title: ret.calendar_title,
    //   calendar_status: ret.calendar_status,
    //   answer_format_class: ret.answer_format_class
    // } );

    setCurrentCalendar( ret );
  };
  /** 算出 */
  const is_register_button_disabled = calendar => {

    if (
      is_past_month( calendar.calendar_title ) ||
      !calendar.calendar_status
    ) {
      /** 過去月である. 未設定状態である. */
      return true;
    }

    if ( calendar.calendar_status === CALENDAR.STATUS.COMFIRM ) {
      /** ステータス「確定」である. */
      if ( isEaseEditRestrictions ) {
        /** 日にち単位の編集可能設定がされている場合は false を返す. */
        return false;
      }

      return true;
    }


    return false;
  };
  const is_setting_button_disabled = calendar => {

    if ( is_past_month( calendar.calendar_title ) ) {
      /** 過去月である. */
      return true;
    }

    if ( calendar.calendar_status === CALENDAR.STATUS.COMFIRM ) {
      /** ステータス「確定」である. */
      if ( isEaseEditRestrictions ) {
        /** 日にち単位の編集可能設定がされている場合は false を返す. */
        return false;
      }

      /** 運営者のみ false を返す. */
      return user.class === AUTHORITY.CLASS.ADMIN ? false : true;
    }


    return false;
  };
  
  const [ calendars, setCalendar ] = React.useState( [] );
  const [ isShowModal, setIsShowModal ] = React.useState( false );
  const [ calendarDetail, setCalendarDetail ] = React.useState( {} );
  const [ currentCalendar, setCurrentCalendar ] = React.useState( {} );
  const [ isEaseEditRestrictions, setIsEaseEditRestrictions ] = React.useState( false );

  const customButtonGroup = { display: "flex", justifyContent: "flex-end" };


  const user = useSelector(state => state.account.user);
  const permissions = useSelector(state => state.account.permissions);

  // console.log(user, permissions);

  const radio_group_name = `radio-group`;
  const comment_name = `comment`;

  const { register, handleSubmit } = useForm();


  useEffect(() => {

    monthChange( dayjs() );

  }, []);


  return (
    <>
      <style>{`
        div.MuiDateCalendar-root div.MuiPickersFadeTransitionGroup-root div.MuiPickersSlideTransition-root {
          min-height: auto;
        }
        div.MuiDateCalendar-root div.MuiPickersFadeTransitionGroup-root div.MuiPickersSlideTransition-root div.MuiDayCalendar-monthContainer {
          position: relative;
        }
      `}</style>
      <LocalizationProvider dateAdapter={ AdapterDayjs }>
        {/* <pre>{ JSON.stringify( calendars.filter(Boolean), null, "\t" ) }</pre> */}
        <h1>{ currentCalendar?.calendar_title ?? `NULL` }</h1>
        <DateCalendar
          slots={{ day: Day }}
          slotProps={{ day: { currentCalendar } }}
          onMonthChange={ monthChange }
        />
        <Grid container sx={{ mt: 4 }}>
          <Grid xs={1}></Grid>
          <Grid xs={10}>
            <Box
              component="form"
              onSubmit={ handleSubmit( register_button_handler ) }
              sx={{ pl: 2.25 }}
            >
              <ActivityRequestTable
                title={ currentCalendar.calendar_title }
                currentCalendarDetail={ currentCalendar.calendar_detail }
              />
              {/* button */}
              <Grid container sx={{ mt: 4 }}>
                <Grid xs={10}></Grid>
                <Grid xs={2}>
                  <div style={ customButtonGroup }>
                    <Button
                      sx={{ mr: 2.25 }}
                      variant="outlined"
                      color="primary"
                      type="submit"
                      disabled={ is_register_button_disabled( currentCalendar ) }
                    >登録</Button>
                    <Button
                      sx={{ mr: 2.25 }}
                      variant="outlined"
                      color="primary"
                      onClick={ () => setting_button_handler( false ) }
                      disabled={ is_setting_button_disabled( currentCalendar ) }
                      href={ `/app/calendar/setting` }
                    >設定</Button>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
        {/* Modal */}
        <Modal
          show={ isShowModal }
          data={ calendarDetail }
        />
      </LocalizationProvider>
    </>
  );
}
