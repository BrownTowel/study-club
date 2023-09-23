import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const address = yup
    .string()
    .required('メールアドレスは必須です.')
    .email('メールアドレスは正しい形式で入力してください.');

const password = yup
    .string();

// const password = yup
//     .string()
//     .required('必須')
//     .min(6, '少ない')
//     .matches(
//         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
//         'パスワード弱い'
//     );


export const login_resolver = { resolver: yupResolver( yup.object( { address: address, password: password, } ) ) };
