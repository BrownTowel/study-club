import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { AUTH_TOKEN } from '../common/const';

const url = process.env.REACT_APP_WEB_SOCKET_URL;
const port = process.env.REACT_APP_WEB_SOCKET_PORT;

const token = localStorage.getItem( AUTH_TOKEN );


export const websocketSlice = createSlice({
    name: "websocket",
    initialState: {
        connection: null,
      },
      reducers: {
        connect: ( state ) => {

            if ( state.connection ) {

                return;
            }


            state.connection = io( `${ url }:${ port }`, { extraHeaders: { Authorization: `Bearer ${ token }` } } );
        }
      }    
});

export const { connect } = websocketSlice.actions;

export default websocketSlice.reducer
