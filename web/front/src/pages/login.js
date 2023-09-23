import React, { useEffect } from 'react';
// import { client } from '../common/axios';
import { client } from '../provider/axios';
// import { setAuth } from '../store/auth';
// import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login_resolver } from '../common/rules'
import { useNavigate, Navigate } from "react-router-dom";
import { setAuth } from '../store/auth';
import { useDispatch } from 'react-redux';
import {
    Button,
    Container,
    Stack,
    TextField,
    Card,
    CardHeader,
    CardContent,
    Box,
    Backdrop
} from '@mui/material';
import Divider from '@mui/material/Divider';

export const Login = () => {

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [ failedMessage, setFailedMessage ] = React.useState();
    const { register, handleSubmit, formState: { errors } } = useForm( login_resolver );

    if ( localStorage.hasOwnProperty( "auth_token" ) ) {
        /** token 所持の場合はエントランスページに遷移 */
        return (
            <Navigate to="/app" replace />
        )
    }

    const onClickHandler = async data => {

        const param = {
            address: data.address,
            password: data.password
        };

        let res = await client.post("/api/auth/credential", param);

        /** レスポンス判定 */
        if (res.status !== 200 || !res.data.credential ) {

            console.log(`Authentication failed.`);

            setFailedMessage( `Authentication failed.` );

            return false;
        }

        const token = res.data.credential.token;

        localStorage.setItem("auth_token", token);

        /** user account */
        res = await client.post("/api/auth/account", { token: token });

        dispatch( setAuth( res.data.account ) );


        /** 遷移 */
        // navigate("/app");

        return (
            <Navigate replace to="/app"/>
        )

        // window.location.href = "/app";
    };



    return (
        <Container maxWidth="sm">
            <Backdrop open={ true } sx={{ zIndex: -1 }}></Backdrop>
            <Stack justifyContent="center" sx={{ height: `100vh` }}>
                <Card raised={ true }>
                    <CardHeader
                        title="Sign In"
                    ></CardHeader>
                    <Divider />
                    <Box sx={{ textAlign: `center` }}>
                        <p>テスト用メールアドレス<br />et@study-club.com<br />yt@study-club.com<br />ko1@study-club.com<br />運営者: tm@study-club.com</p>
                    </Box>
                    <CardContent>
                        <Box component="form" sx={{ mt: 1 }}>
                            <Stack spacing={4}>
                                <Stack spacing={2} alignItems="center">
                                    <TextField
                                        required
                                        label="MailAddress"
                                        type="email"
                                        {...register('address')}
                                        error={"address" in errors}
                                        helperText={errors.address?.message}
                                        sx={{ width: `80%` }}
                                    ></TextField>
                                    <TextField
                                        required
                                        label="Password"
                                        type="password"
                                        {...register('password')}
                                        error={"password" in errors}
                                        helperText={errors.password?.message}
                                        sx={{ width: `80%` }}
                                    ></TextField>
                                </Stack>
                                <Stack spacing={2}>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        sx={{ py: 2 }}
                                        onClick={ handleSubmit( onClickHandler ) }
                                    >Sign in with Credentials</Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    )

    // return (
    //     <div className="page">
    //         <div className="signin">
    //             <div className="card">
    //                 <div className="provider">
    //                     <p>テスト用メールアドレス<br />et@study-club.com<br />yt@study-club.com<br />ko1@study-club.com<br />運営者: tm@study-club.com</p>
    //                     <p>{ failedMessage }</p>
    //                     <form>
    //                         <div>
    //                             {/* <label className="section-header" htmlFor="input-address-for-credentials-provider">MailAddress</label> */}
    //                             {/* <input
    //                                 name="address"
    //                                 id="input-address-for-credentials-provider"
    //                                 type="text"
    //                                 placeholder="jsmith"
    //                                 label="MailAddress"
    //                                 required
    //                                 { ...register( "address" ) }
    //                             /> */}
    //                             <TextField
    //                                 required
    //                                 label="MailAddress"
    //                                 type="email"
    //                                 {...register('address')}
    //                                 error={"address" in errors}
    //                                 helperText={errors.address?.message}
    //                             ></TextField>
    //                         </div>
    //                         <div>
    //                             {/* <label className="section-header" htmlFor="input-password-for-credentials-provider">Password</label>
    //                             <input
    //                                 name="password"
    //                                 id="input-password-for-credentials-provider"
    //                                 type="password"
    //                                 placeholder=""
    //                                 label="Password"
    //                                 { ...register( "password" ) }
    //                                 error={"password" in errors}
    //                                 helperText={errors.password?.message}
    //                             /> */}
    //                             <TextField
    //                                 required
    //                                 label="Password"
    //                                 type="password"
    //                                 {...register('password')}
    //                                 error={"password" in errors}
    //                                 helperText={errors.password?.message}
    //                             ></TextField>
    //                         </div>
    //                         {/* <button type="button" onClick={ onClickHandler }>Sign in with Credentials</button> */}
    //                         <button type="button" onClick={ handleSubmit( onClickHandler ) }>Sign in with Credentials</button>
    //                     </form>
    //                 </div>
    //             </div>
    //         </div>
    //         <style>{`
    //             :root {
    //                 --border-width: 1px;
    //                 --border-radius: 0.5rem;
    //                 --color-error: #c94b4b;
    //                 --color-info: #157efb;
    //                 --color-info-text: #fff
    //             }

    //             .__next-auth-theme-auto,.__next-auth-theme-light {
    //                 --color-background: #ececec;
    //                 --color-background-card: #fff;
    //                 --color-text: #000;
    //                 --color-primary: #444;
    //                 --color-control-border: #bbb;
    //                 --color-button-active-background: #f9f9f9;
    //                 --color-button-active-border: #aaa;
    //                 --color-seperator: #ccc
    //             }

    //             .__next-auth-theme-dark {
    //                 --color-background: #161b22;
    //                 --color-background-card: #0d1117;
    //                 --color-text: #fff;
    //                 --color-primary: #ccc;
    //                 --color-control-border: #555;
    //                 --color-button-active-background: #060606;
    //                 --color-button-active-border: #666;
    //                 --color-seperator: #444
    //             }

    //             @media (prefers-color-scheme: dark) {
    //                 .__next-auth-theme-auto {
    //                     --color-background:#161b22;
    //                     --color-background-card: #0d1117;
    //                     --color-text: #fff;
    //                     --color-primary: #ccc;
    //                     --color-control-border: #555;
    //                     --color-button-active-background: #060606;
    //                     --color-button-active-border: #666;
    //                     --color-seperator: #444
    //                 }
    //             }

    //             body {
    //                 background-color: var(--color-background);
    //                 font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
    //                 margin: 0;
    //                 padding: 0
    //             }

    //             h1 {
    //                 font-weight: 400;
    //                 margin-bottom: 1.5rem;
    //                 padding: 0 1rem
    //             }

    //             h1,p {
    //                 color: var(--color-text)
    //             }

    //             form {
    //                 margin: 0;
    //                 padding: 0
    //             }

    //             label {
    //                 font-weight: 500;
    //                 margin-bottom: .25rem;
    //                 text-align: left
    //             }

    //             input[type],label {
    //                 color: var(--color-text);
    //                 display: block
    //             }

    //             input[type] {
    //                 background: var(--color-background-card);
    //                 border: var(--border-width) solid var(--color-control-border);
    //                 border-radius: var(--border-radius);
    //                 box-sizing: border-box;
    //                 font-size: 1rem;
    //                 padding: .5rem 1rem;
    //                 width: 100%
    //             }

    //             input[type]:focus {
    //                 box-shadow: none
    //             }

    //             p {
    //                 font-size: 1.1rem;
    //                 line-height: 2rem;
    //                 margin: 0 0 1.5rem;
    //                 padding: 0 1rem
    //             }

    //             a.button {
    //                 line-height: 1rem;
    //                 text-decoration: none
    //             }

    //             a.button:link,a.button:visited {
    //                 background-color: var(--color-background);
    //                 color: var(--color-primary)
    //             }

    //             button span {
    //                 flex-grow: 1
    //             }

    //             a.button,button {
    //                 align-items: center;
    //                 background-color: var(--provider-bg,var(--color-background-card));
    //                 border-color: rgba(0,0,0,.1);
    //                 border-radius: var(--border-radius);
    //                 color: var(--provider-color,var(--color-primary));
    //                 display: flex;
    //                 font-size: 1.1rem;
    //                 font-weight: 500;
    //                 justify-content: center;
    //                 margin: 0 0 .75rem;
    //                 min-height: 62px;
    //                 padding: .75rem 1rem;
    //                 position: relative;
    //                 transition: all .1s ease-in-out
    //             }

    //             @media (max-width: 450px) {
    //                 a.button,button {
    //                     font-size:.9rem
    //                 }
    //             }

    //             a.button:active,a.button:hover,button:active,button:hover {
    //                 cursor: pointer
    //             }

    //             a.button #provider-logo,button #provider-logo {
    //                 display: block;
    //                 width: 25px
    //             }

    //             a.button #provider-logo-dark,button #provider-logo-dark {
    //                 display: none
    //             }

    //             #submitButton {
    //                 background-color: var(--brand-color,var(--color-info));
    //                 color: var(--button-text-color,var(--color-info-text));
    //                 width: 100%
    //             }

    //             @media (prefers-color-scheme: dark) {
    //                 a.button,button {
    //                     background-color:var(--provider-dark-bg,var(--color-background));
    //                     color: var(--provider-dark-color,var(--color-primary))
    //                 }

    //                 #provider-logo {
    //                     display: none!important
    //                 }

    //                 #provider-logo-dark {
    //                     display: block!important;
    //                     width: 25px
    //                 }
    //             }

    //             a.site {
    //                 color: var(--color-primary);
    //                 font-size: 1rem;
    //                 line-height: 2rem;
    //                 text-decoration: none
    //             }

    //             a.site:hover {
    //                 text-decoration: underline
    //             }

    //             .page {
    //                 display: grid;
    //                 height: 100%;
    //                 margin: 0;
    //                 padding: 0;
    //                 place-items: center;
    //                 position: absolute;
    //                 width: 100%
    //             }

    //             .page>div {
    //                 text-align: center
    //             }

    //             .error a.button {
    //                 display: inline-block;
    //                 margin-top: .5rem;
    //                 padding-left: 2rem;
    //                 padding-right: 2rem
    //             }

    //             .error .message {
    //                 margin-bottom: 1.5rem
    //             }

    //             .signin input[type=text] {
    //                 display: block;
    //                 margin-left: auto;
    //                 margin-right: auto
    //             }

    //             .signin hr {
    //                 border: 0;
    //                 border-top: 1px solid var(--color-seperator);
    //                 display: block;
    //                 margin: 2rem auto 1rem;
    //                 overflow: visible
    //             }

    //             .signin hr:before {
    //                 background: var(--color-background-card);
    //                 color: #888;
    //                 content: "or";
    //                 padding: 0 .4rem;
    //                 position: relative;
    //                 top: -.7rem
    //             }

    //             .signin .error {
    //                 background: #f5f5f5;
    //                 background: var(--color-error);
    //                 border-radius: .3rem;
    //                 font-weight: 500
    //             }

    //             .signin .error p {
    //                 color: var(--color-info-text);
    //                 font-size: .9rem;
    //                 line-height: 1.2rem;
    //                 padding: .5rem 1rem;
    //                 text-align: left
    //             }

    //             .signin form,.signin>div {
    //                 display: block
    //             }

    //             .signin form input[type],.signin>div input[type] {
    //                 margin-bottom: .5rem
    //             }

    //             .signin form button,.signin>div button {
    //                 width: 100%
    //             }

    //             // .signin form,.signin>div {
    //             //     max-width: 300px
    //             // }

    //             .logo {
    //                 display: inline-block;
    //                 margin-bottom: 25px;
    //                 margin-top: 20px;
    //                 max-height: 70px;
    //                 max-width: 150px
    //             }

    //             @media screen and (min-width: 450px) {
    //                 .card {
    //                     width:350px
    //                 }
    //             }

    //             @media screen and (max-width: 450px) {
    //                 .card {
    //                     width:200px
    //                 }
    //             }

    //             .card {
    //                 background-color: var(--color-background-card);
    //                 border-radius: 30px;
    //                 margin: 20px 0;
    //                 padding: 20px 50px
    //             }

    //             .card .header {
    //                 color: var(--color-primary)
    //             }

    //             .section-header {
    //                 color: var(--color-text)
    //             }
    //         `}</style>
    //     </div>
    // )
}
