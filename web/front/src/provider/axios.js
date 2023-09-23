import { useEffect } from 'react';
import axios from 'axios';
import { AUTH_TOKEN, EXPIRED_TOKEN_RESPONSE_MESSAGE } from '../common/const';
import { useNavigate } from "react-router-dom"

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;

const headers = {
    "Content-Type": "application/json",
    // "Content-Type": "application/x-www-form-urlencoded"
    // "Content-Type": "text/plain"
    "Accept": "application/json"
};

// const token = localStorage.getItem( AUTH_TOKEN );

// if ( token ) {

//     headers[ "Authorization" ] = `Bearer ${ token }`;
// }


const timeout = 18000;

export const client = axios.create({
    baseURL: `${url}:${port}`,
    headers: headers,
    timeout: timeout
});


export function AxiosClientProvider( { children } ) {

    const navigate = useNavigate();

    useEffect( () => {
        /**
         * インターセプト
         */
        const requestInterceptors = client.interceptors.request.use( config => {

            console.log("request", config);

            const token = localStorage.getItem( AUTH_TOKEN );

            if ( token ) {

                config.headers[ "Authorization" ] = `Bearer ${ token }`;
            }

            /** Cannot read properties of undefined (reading 'cancelToken') */
            /** configをreturnしないとresponse側のインターセプトでエラーとなった */
            return config;
        });

        const responseInterceptor = client.interceptors.response.use(

            response => {

                console.log("response", response);

                return response;
            },

            error => {
                const name = `${error.name}`;
                const code = `${error.code}`;
                const message = `${error.message}`;
                const url = `${error.config.baseURL}${error.config.url}`;

                console.log(`${code}: ${name}, ${url}, ${message}.`);
                
                console.log(error.response);

                if ( error.response.status === 400 ) {

                    const { data } = error.response;
                    const message = data.message ?? "";

                    if ( message === EXPIRED_TOKEN_RESPONSE_MESSAGE ) {

                        localStorage.removeItem( AUTH_TOKEN );

                        /** redirect */
                        navigate("/login", { replace: true });
                    }
                }

                return Promise.reject(error);
            }
        );

        // return () => {

        //     client.interceptors.request.eject( requestInterceptors );
        //     client.interceptors.response.eject( responseInterceptor );
        // }

    }, [] );

    return ( <>{children}</> );
}
