import Button from '@mui/material/Button';
import { WEB_SOCKET } from '../common/const';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Divider from "@mui/material/Divider";
import { connect } from '../store/websocket';
import { useSelector } from 'react-redux';


const Item = styled(Paper)(({ theme, maxWidth=400 }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: maxWidth,
}));


export const Chat = () => {

    const user = useSelector(state => state.account.user);

    /**
     * connect
     */
    const dispatch = useDispatch();
    dispatch( connect() );

    const socket = useSelector( state => state.websocket.connection );

    const socket_id = useRef(socket.id);

    /**
     * reactive
     */
    const chat_box = useRef();
    const read_divider = useRef();

    const message = useRef('');
    const cursor = useRef(0);
    const [ chatContents, setChatContents ] = useState([]);
    /**
     * スクロール制御.
     *   stale-closureの問題により真偽値で制御.
     */
    const is_forward = useRef(false);
    const current_scroll_height = useRef();


    const onPostClickHandler = () => {

        socket.emit( WEB_SOCKET.RECEIVER.CHAT.POST, { content: message.current.value } );

        message.current.value = '';
    }

    const onScroll = useCallback( e => {

        const { scrollTop } = e.target;

        if ( scrollTop || ! cursor.current ) {

            return;
        }

        socket.emit( WEB_SOCKET.RECEIVER.CHAT.FETCH,  { cursor: cursor.current } );
    } );

    /**
     * 初期表示
     */
    useEffect( () => {

        chat_box.current.addEventListener("scroll", onScroll );

        socket.emit( WEB_SOCKET.RECEIVER.CHAT.FETCH,  { cursor: cursor.current } );

    }, [] );
    /**
     * チャット情報更新時
     */
    useEffect( () => {

        const scroll_x = is_forward.current ?
            chat_box.current.scrollHeight :
            chat_box.current.scrollHeight - current_scroll_height.current ;


        chat_box.current.scrollTo( 0, scroll_x )

        cursor.current = chatContents.length;


        is_forward.current = is_forward.current && false ;

    }, [ chatContents ]);



    socket.on( WEB_SOCKET.RECEIVER.CHAT.FETCH, onFetch );
    /**
     * チャット情報取得 受信処理.
     *
     * @param {*} r 
     * @returns 
     */
    function onFetch(r) {

        if ( ! r.length ) {

            return;
        }

        if ( ! cursor.current ) {
            /**
             * 初回のみ下部へスクロール.
             */
            is_forward.current = true;

            socket_id.current = socket.id;
        }

        current_scroll_height.current = chat_box.current.scrollHeight;

        setChatContents( [ ...r, ...chatContents ] );
    }


    socket.on(WEB_SOCKET.RECEIVER.CHAT.POST, onChat);
    /**
     * チャット送信 送信後受信処理.
     *
     * @param {*} r 
     * @returns 
     */
    function onChat(r) {

        const { status, message, data } = r;
  
        if ( status !== 200 ) {

            console.error( message );
            window.alert("メッセージの送信に失敗しました");

            return false;
        }

        setChatContents( [ ...chatContents, data ] );

        is_forward.current = true;
    };

    return (
        <>{socket_id.current}<br/>{current_scroll_height.current}
            <Box width="50%">
                <Box
                    ref={ chat_box }
                    align="right"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'text.disabled',
                        maxHeight: '60vh',
                        borderRadius: '4px 4px 0 0',
                        p: 2,
                        pb: 0,
                        overflowY: 'scroll'
                    }}
                >

                    {
                        chatContents.map( c => {

                            const is_self = user.id === c.createAccountId;

                            const align = is_self ? "right" : "left" ;

                            return (
                                <Box sx={{ pb: 2 }} align={ align } key={ c.sequenceNumber }>
                                    <Item>
                                        <Stack spacing={ 2 } direction="row">
                                            <Avatar>W</Avatar>
                                            <Typography>{ c.content }</Typography>
                                        </Stack>
                                    </Item>
                                </Box>
                            );
                        } )
                    }

                </Box>
                <Box>
                    <Item sx={{ display: 'flex', maxWidth: '100%', borderRadius: '0 0 4px 4px' }}>
                        <TextField
                            inputRef={message}
                            fullWidth
                            multiline
                            maxRows={4}
                            sx={{ mr: 2 }}
                        ></TextField>
                        <Button variant="contained" endIcon={<SendIcon />} sx={{ px: 3, height: '56px' }} onClick={ onPostClickHandler }>Send</Button>
                    </Item>
                </Box>
            </Box>
        </>
    );
}