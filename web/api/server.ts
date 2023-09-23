// server.js
import { createServer as http_server } from 'http';
import { createServer as https_server } from 'https';
import fs from 'node:fs';

import { parse } from 'url';
import next from 'next';
// account permission
import { get_permission_info } from '@/hooks/process/permission';
import { get_public_pages, public_notice } from '@/hooks/process/public_page';
import { http as constHttp } from '@/lib/constant/http';
import { WEB_SOCKET } from '@/lib/constant/const';
// import { WebSocketServer, WebSocket } from "ws";
import { Server as WebSocketServer } from "socket.io";

// server.js
// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// account permission
// const getPermissionInfo = require('./hooks/process/account');
// const { getPublicPages } = require('./hooks/process/public_page');

import { decoded_json_web_token } from '@/hooks/process/token';
import { JwtPayload } from 'jsonwebtoken';

import { chat } from '@/lib/ws/chat';

/** グローバル ********* */
console.log(`*** Set Global Variables ***`);

globalThis.PERMISSION_INFO = get_permission_info();
globalThis.SESSION = [];
globalThis.SESSION_FILE_LOCK = false;
globalThis.PUBLIC_PAGES = get_public_pages();


const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.NODE_HOST ?? 'localhost';
const port = parseInt( process.env.NODE_PORT ?? "3000", 10 );

const ws_port = parseInt( process.env.WEBSOCKET_PORT ?? String( port + 1 ) );

/**
 * ssl
 */
const key = process.env.SSL_KEY_FILE_PATH ?? '' ;
const cert = process.env.SSL_CERT_FILE_PATH ?? '' ;


// ミドルウェアを利用する場合、 `hostname` と `port` を以下のように提供する必要があります。
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();


const listener = async (req: any, res: any) => {

  try {

    // if (req.method === 'OPTIONS') {
    //   /** preflight */
    //   res.statusCode = constHttp.OK.code;
    //   res.end()

    //   return
    // }

    console.log(req)

    console.log(`** url: ${ req.url }, method: ${ req.method } **`);

    // `url.parse` の2番目の引数として必ず `true` を渡してください。
    // これは、URLのクエリ部分を解析するように指示します。
    const parsedUrl = parse( req.url, true );
    const { pathname, query } = parsedUrl;


    // /** グローバル ********* */
    // globalThis.PERMISSION_INFO = get_permission_info();
    // globalThis.SESSION = [];
    // globalThis.SESSION_FILE_LOCK = false;
    // globalThis.PUBLIC_PAGES = await get_public_pages();

    const public_pages = await globalThis.PUBLIC_PAGES;
    const public_page = public_pages.find( page =>  `/${page.url}` === pathname );
    
    // /** @todo */
    // res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    // res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')


    if ( public_page ) {

      /** Notice PublicPage Route */
      const [ status, content_type, content, encoding ] = public_notice( public_page );

      if ( status === 404 ) {
        /** 404 */
        await handle(req, res, parsedUrl);
      } else {

        res.writeHead( status, content_type );
        res.end( content, encoding );
      }

    } else {

      console.log(`API Route [pathname: ${ pathname }]`);

      await handle(req, res, parsedUrl);

    }

    // if ( public_page ) {

    //   /** Notice PublicPage Route */
    //   const [ status, content_type, content, encoding ] = public_notice( public_page );

    //   if ( status === 404 ) {
    //     /** 404 */
    //     await handle(req, res, parsedUrl);
    //   } else {

    //     res.writeHead( status, content_type );
    //     res.end( content, encoding );
    //   }

    // } else if (pathname === '/b') {

    //   console.log("route /b");

    //   await app.render(req, res, '/b', query);

    // } else {

    //   console.log("API Route");

    //   await handle(req, res, parsedUrl);

    // }

  } catch ( err ) {

    console.error('Error occurred handling', req.url, err);

    res.statusCode = 500;
    res.end('internal server error');

  }

}



const websocket_listener = async ( req: any, res: any ) => {


  console.log(`++ websocket server ++`);

  // let connections: WebSocket[] = [];
  // const wss = new WebSocketServer({ port: ws_port });

  // wss.on(
  //   WEB_SOCKET.CONNECTION,
  //   socket => {
  //     console.log("a user connected");

  //     socket.on( WEB_SOCKET.RECEIVER.CHAT, ( message: any ) => { console.log(`received`); return message; } );
  //   }
  // );
}


/**
 * typescriptでの起動
 *
 * ./node_modules/.bin/ts-node --files -r tsconfig-paths/register server.ts
 */
app.prepare().then(() => {
  
  let websocket_server;

  if (dev) {
    /**
     * http server
     */
    http_server( listener )
    .listen( port, () => {

      console.log(`> Ready on http://${hostname}:${port}`);
    } );
    /**
     * websocket
     */
    websocket_server = http_server( websocket_listener )
    .listen(ws_port, () => {

      console.log(`> Ready on http://${hostname}:${ws_port}`);
    } );

  } else {

    const server_options = {
      key: fs.readFileSync( key ),
      cert: fs.readFileSync( cert ),
    };

    /**
     * http server
     */
    https_server( server_options, listener )
    .listen( port, () => {

      console.log(`> Ready on https://${hostname}:${port}`);
    } );
    /**
     * websocket
     */
    websocket_server = https_server( server_options, websocket_listener )
    .listen(ws_port, () => {

      console.log(`> Ready on https://${hostname}:${ws_port}`);
    } );

  }




  // .listen(port, (err: any) => {

  //   if ( err ) {
  //       throw err;
  //   }

  //   console.log(`> Ready on http://${hostname}:${port}`);
  // })

    
    



  // /**
  //  * websocket
  //  */
  // const websocket_server = createServer( websocket_listener )
  // .listen(ws_port, () => {

  //   console.log(`> Ready on http://${hostname}:${ws_port}`);
  // } );


  const options = {
    cors: {
      origin: ["http://localhost:3080"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  };

  const wss = new WebSocketServer( websocket_server, options );

  wss.use( ( socket, next ) => {

    // console.log( `socket.handshake` );
    // console.log( socket.handshake.headers.authorization );


    const authorization: string | undefined = socket.handshake.headers?.authorization;

    if ( ! authorization ) {

      console.log( `Authorization Error.` );

      next( new Error( `Authorization Error.` ) );

      return false;
    }

    const [ _, token ]: string[] = authorization.split(" ");

    if ( ! token || token === `null` ) {

      console.log( `token Error.` );

      next( new Error( `token Error.` ) );

      return false;
    }

    // const payload: JwtPayload = decoded_json_web_token( token );

    // console.log(payload);

    next();
  } );

  // wss.on(
  //   WEB_SOCKET.CONNECTION,
  //   socket => {
  //     console.log("a user connected");

  //     const [ _, token ]: string[] = socket.handshake.headers.authorization.split(" ");

  //     const payload: JwtPayload = decoded_json_web_token( token );

  //     console.log(`payload`);
  //     console.log(payload);

  //     // console.log(socket);

  //     /**
  //      * チャットコンテンツ取得
  //      * チャットコンテンツ登録
  //      * チャットコンテンツ編集
  //      * チャットコンテンツ削除
  //      * チャットコンテンツ閲覧情報更新
  //      */

  //     socket.on(
  //       WEB_SOCKET.RECEIVER.CHAT.POST,
  //       ( message: any ) => {
        
  //         console.log(`received`);
  //         console.log(payload);
  //         console.log(message);
  //         wss.emit( WEB_SOCKET.RECEIVER.CHAT.POST, message );
  //       }
  //     );
  //   }
  // );

  const onConnectionListener = ( socket: (...args: any[] ) => void) => {
    chat( wss, socket );
  };

  wss.on(WEB_SOCKET.CONNECTION, onConnectionListener);
});
