// server.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
// account permission
import { get_permission_info } from '@/hooks/process/permission';
import { get_public_pages, public_notice } from '@/hooks/process/public_page';
import { http as constHttp } from '@/lib/constant/http'

// server.js
// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// account permission
// const getPermissionInfo = require('./hooks/process/account');
// const { getPublicPages } = require('./hooks/process/public_page');

/** グローバル ********* */
console.log(`*** Set Global Variables ***`);

globalThis.PERMISSION_INFO = get_permission_info();
globalThis.SESSION = [];
globalThis.SESSION_FILE_LOCK = false;
globalThis.PUBLIC_PAGES = get_public_pages();


const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// ミドルウェアを利用する場合、 `hostname` と `port` を以下のように提供する必要があります。
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();


/**
 * typescriptでの起動
 *
 * ./node_modules/.bin/ts-node --files -r tsconfig-paths/register server.ts
 */
app.prepare().then(() => {
  createServer(async (req: any, res: any) => {
    try {

      // if (req.method === 'OPTIONS') {
      //   /** preflight */
      //   res.statusCode = constHttp.OK.code;
      //   res.end()

      //   return
      // }

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

    } catch (err) {

      console.error('Error occurred handling', req.url, err);

      res.statusCode = 500;
      res.end('internal server error');

    }

  })
  .listen(port, () => {

    console.log(`> Ready on http://${hostname}:${port}`);
  })

  // .listen(port, (err: any) => {

  //   if ( err ) {
  //       throw err;
  //   }

  //   console.log(`> Ready on http://${hostname}:${port}`);
  // })

});
