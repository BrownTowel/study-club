// import logo from './logo.svg';
import './App.css';
/** Router */
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './provider/sidebar';
import { useSelector } from 'react-redux';
// import { client } from './common/axios';
import { setAuth } from './store/auth';
import { useDispatch } from 'react-redux';
import routes from './routes';
import { NotFound } from './pages/404';
import { authorize_routes } from './lib/permission';
import { AUTH_TOKEN } from './common/const';
import { client, AxiosClientProvider } from './provider/axios';

/**
 * 初回アクセス時、ローカルストレージにtokenを保持している場合にアカウント情報の取得を行う.
 * Privateコンポーネント呼び出し時にアカウント情報を取得できている場合はアカウントstateにセットする.
 * (
 *    アカウントstateへのアカウント情報セットはログイン時にも行われている.
 *    ログイン時のページ遷移はログインコンポーネントでアカウント情報のセットが行われている.
 * )
 * 
 * アカウントstateから権限情報を取得し認可ルートのみレンダリングを行う.
 *
 * アカウントstateにアカウント情報を保持している場合はPrivateコンポーネントを返却する.
 * アカウントstateにアカウント情報を保持していない場合はログインページへ遷移する.
 */
const token = localStorage.getItem( AUTH_TOKEN );

let account;

if ( token ) {

  const res = await client.post("/api/auth/account", { token: token });

  account = res.data.account;
}

const Private = ( props ) => {

  const dispatch = useDispatch();

  if ( account ) {

    dispatch( setAuth( account ) );
  }

  const user = useSelector(state => state.account.user);
  const permissions = useSelector(state => state.account.permissions);

  if ( !user ) {

    return (
      <Navigate replace to="/login" />
    );
  }

  // const authorize_routes = props.routes
  //   .filter(
  //     route => permissions[ route.id ] ?
  //       permissions[ route.id ].length ?
  //         route :
  //         false :
  //       false
  //   );

  const routes = authorize_routes( props.routes, permissions );
  

  return (
    <Sidebar>
      <Routes>
        {
          routes.map( child => child.path === "/" ?
            <Route key={ child.id } index element={ child.element } /> :
            <Route key={ child.id } path={ child.path } element={ child.element } />
          )
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Sidebar>
  )
}

// const Private = () => {

//   const dispatch = useDispatch();

//   const token = localStorage.getItem( "auth_token" );

//   // const user = useSelector(state => state.account.user);

//   // console.log("PrivateRoute", user);

//   if (!token) {

//     return (
//       <Navigate replace to="/login" />
//     );
//   }

//   const res = client.post("/api/auth/account", { token: token });

//   console.log(`account response`, res);

//   if (!res.data.account) {

//     return (
//       <Navigate replace to="/login" />
//     );
//   }

//   dispatch( setAuth( res.data.account ) );

//   return (
//     <Sidebar>
//       <Outlet />
//     </Sidebar>
//   )

/**
  useEffect(() => {

    (async () => {

      const token = localStorage.getItem( "auth_token" );
    
      if (!token) {
    
        return (
          <Navigate replace to="/login" />
        );
      }
    
      const res = await client.post("/api/auth/account", { token: token });

      console.log(`account response`, res);
    
      if (!res.data.account) {
    
        return (
          <Navigate replace to="/login" />
        );
      }
    
      dispatch( setAuth( res.data.account ) );
    
      return (
        <Sidebar>
          <Outlet />
        </Sidebar>
      )
    
    })();
  }, []);
 */
// }

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/calendar" element={<Calendar />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </div>
  // );

  // const auth = useSelector(state => state.account);

  // console.log(`App.js: ${auth}`);
    // { auth ? ( <></> ) : ( <><Navigate to="/login" replace /></> ) }

    // const match = useMatch("/login");
    // const { pathname } = useLocation();

    // console.log(match);
    // console.log(pathname);
    

  /**
   * Routes
   *    S-00-01	ログイン画面              /login
   *    S-01-01	エントランス画面          /app
   *    S-02-01	ビデオチャット画面        /app/room
   *    S-03-01	活動日カレンダー画面      /app/calendar
   *    S-03-02	活動日カレンダー設定画面  /app/calendar/setting
   *    S-04-01	告知一覧画面             /app/notice
   *    S-04-02	告知登録画面             /app/notice/new
   *    S-04-03	告知詳細画面             /app/notice/{id}
   *    S-04-04	告知編集画面             /app/notice/{id}/edit
   *    S-05-01	アカウント一覧画面        /app/account
   *    S-05-02	アカウント登録画面        /app/account/new
   *    S-05-03	アカウント詳細画面        /app/account/{id}
   *    S-05-04	アカウント編集画面        /app/account/{id}/edit
   *    S-06-01	サーバーリソース監視画面  /app/develop/resource
   *    S-07-01	環境設定画面             /app/setting
   */

  // const render_route = ( routes ) => {

  //   console.log(`render_route Component ***`);

  //   return routes.map( route => {

  //     if ( "children" in route ) {
  //       /** 非公開ページの返却 */
  //       return (
  //         <Route key={ route.name } path={ route.path } element={ <Private /> }>
  //           {
  //             route.children.map( child => child.path === "/" ?
  //               <Route key={ child.name } index element={ child.element } /> :
  //               <Route key={ child.name } path={ child.path } element={ child.element } />
  //             )
  //           }
  //         </Route> )
  //     }
  //     /** 公開ページの返却 */
  //     return ( <Route key={ route.name } path={ route.path } element={ route.element } /> );
  //   });
  // };


  const render_route = ( routes ) => {

    return routes.map( route => {

      if ( "children" in route ) {
        /** 非公開ページの返却 */
        return ( <Route key={ route.id } path={ route.path } element={ <Private routes={ route.children } /> }></Route> )
      }
      /** 公開ページの返却 */
      return ( <Route key={ route.id } path={ route.path } element={ route.element } /> );
    });
  };

  console.log(`App Component ***`);

  return (
    <>
      <BrowserRouter>
        <AxiosClientProvider>
          <Routes>
            { render_route( routes ) }
            <Route path="*" element={ <NotFound /> } />
          </Routes>
        </AxiosClientProvider>
      </BrowserRouter>
    </>
  );

  // return (
  //   <>
  //     <BrowserRouter>
  //         <Routes>
  //           <Route path="/login" element={<Login />} />
  //           <Route path="*" element={<NotFound />} />
  //           <Route path="/app/*" element={<Private />}>
  //             <Route index element={<Entrance />} />
  //             <Route path="calendar" element={<Calendar />} />
  //             <Route path="calendar/setting" element={<CalendarSetting />} />
  //           </Route>
  //         </Routes>
  //     </BrowserRouter>
  //   </>
  // );
}

export default App;
