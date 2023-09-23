import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { teal } from "@mui/material/colors";
import FormControl, { useFormControl } from '@mui/material/FormControl';
import { client } from '../common/axios';
// import { useCookies } from "react-cookie";
import axios from 'axios';
import React, { useEffect } from 'react';
import parse from 'html-react-parser';

const onClickHandler = async e => {

    e.preventDefault();

    console.log("submit");

    // const url = process.env.REACT_APP_API_URL;
    // const port = process.env.REACT_APP_API_PORT;

    // const headers = {
    //     "Content-Type": "application/json",
    //     // "Content-Type": "application/x-www-form-urlencoded",
    // };

    // const timeout = 180;

    // const client = axios.create({
    //     // withCredentials: true,
    //     baseURL: `${url}:${port}`,
    //     headers: headers,
    //     timeout: timeout
    // });

    // // http://localhost:3000/api/auth/csrf

    // const res1 = await client.get(`/api/auth/signin`);

    // console.log(res1)

    // const param = {
    //     username: e.target.username.value,
    //     password: e.target.password.value
    // };

    // console.log(param);

    // http://localhost:3000/api/auth/callback/credentials

    // const res = await client.get(`/api/auth/callback/credentials`);

};

export const Login = () => {

    const [ screen, setScreen ] = React.useState( "" );

    useEffect(() => {
    
        ( async () => {
    
            const res = await client.get("/api/auth/signin");
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(res.data, "text/html");
        
            const page = doc.getElementsByClassName("page")[0];

            const style = doc.getElementsByTagName("style")[0];
            page.appendChild(style);

            setScreen( page.outerHTML );
        } )();
    }, []);

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(screen, "text/html");

    // const page = doc.getElementsByClassName("page")[0];

    // // const page = parse( screen );

    // if (page) {

    //     setScreen(page.outerHTML);
    // }

    return parse( screen );
};

// export const Login = () => {

//     return (
//         <Grid style={{ textAlign: "center" }}>
//             <form onSubmit={ onClickHandler }>
//                 <FormControl>
//                     <Paper
//                         elevation={3}
//                         sx={{
//                             p: 4,
//                             height: "70vh",
//                             m: "20px auto"
//                         }}
//                     >
//                         <Grid
//                             container
//                             direction="column"
//                             justifyContent="flex-start"
//                             alignItems="center"
//                         >
//                             <Avatar sx={{ bgcolor: teal[400] }}>
//                                 <LockOutlinedIcon />
//                             </Avatar>
//                             <Typography variant={"h5"} sx={{ m: "30px" }}>
//                                 Sign In
//                             </Typography>
//                         </Grid>
//                         <TextField label="Username" variant="standard" name="username" fullWidth required />
//                         <TextField
//                             type="password"
//                             label="Password"
//                             name="password"
//                             variant="standard"
//                             fullWidth
//                             required
//                         />
//                         {/*
//                         <FormControlLabel
//                             labelPlacement="end"
//                             label="パスワードを忘れました"
//                             control={<Checkbox name="checkboxA" size="small" color="primary" />}
//                         />
//                         */}
//                         <Box mt={5} px={4}>
//                             <Button type="submit" color="primary" variant="contained" fullWidth>
//                                 サインイン
//                             </Button>

//                             {/*
//                             <Typography variant="caption">
//                                 <Link href="#">パスワードを忘れましたか？</Link>
//                             </Typography>
//                             <Typography variant="caption" display="block">
//                                 アカウントを持っていますか？
//                                 <Link href="#">アカウントを作成</Link>
//                             </Typography>
//                             */}
//                         </Box>
//                     </Paper>
//                 </FormControl>
//             </form>
//         </Grid>
//     );
// };
