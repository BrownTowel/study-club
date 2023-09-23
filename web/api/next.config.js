/** @type {import('next').NextConfig} */

// import * as mariadb from './node_modules/mariadb';

// import { getAccount } from './hooks/process/account';
// const getAccount = require('./hooks/process/account');
// const getAccount = require("./hooks/process/account");

// const nextConfig = {
//   reactStrictMode: true,
//   async headers() {
//     return [
//       {
//         "source": "/(.*)",
//         "headers": [
//           // { "key": "Access-Control-Allow-Credentials", "value": "true" },
//           { "key": "Access-Control-Allow-Origin", "value": "*" },
//           // { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
//           // { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
//         ]
//       }
//     ]
//   }
// }

// module.exports = nextConfig

// console.log(process.env["CXN"]);


// const mariadb = require("mariadb");

// if ( !process.env.CXN ) {

//   const connection = mariadb.createPool({
//     host: 'localhost',
//     user: 'yt',
//     password: 'password',
//     database: 'study_club',
//     connectionLimit: 2
//   });

//   // const conn = await connection.getConnection();

//   process.env.CXN = connection.getConnection();
// }

/** Permission */
// process.env.PERMISSION = getAccount();


/** Permission */
// process.env.PERMISSION = JSON.stringify( (( permission_info ) => {

//   const CLASS_PERMISSION = {};

//   for (const info of permission_info) {

//     const SCREEN_PERMISSION = {};

//     for (const permission of info.permissions) {

//       SCREEN_PERMISSION[ permission.screen_id ] = permission.permission;
//     }

//     CLASS_PERMISSION[ info.class ] = SCREEN_PERMISSION;

//   }


//   return CLASS_PERMISSION;

// })( require("./resources/permission.json").permission_info ) );



module.exports = () => {

  // const mariadb = require("mariadb");

  // if ( !process.env.CXN ) {

  //   const connection = mariadb.createPool({
  //     host: 'localhost',
  //     user: 'yt',
  //     password: 'password',
  //     database: 'study_club',
  //     connectionLimit: 2
  //   });

  //   // globalThis.app = {};
  //   // globalThis.app.CNX = "CNX";
    
  //   // console.log(globalThis);
    
    
  //   // process.env.CXN = await connection.getConnection();
  //   // global.CXN = await connection.getConnection();
  // }

  const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          "source": "/(.*)",
          "headers": [
            { "key": "Access-Control-Allow-Origin", "value": "*" },
            { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
            { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
          ]
        }
      ]
    }
  }

  return nextConfig;
}
