import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './auth';

export default configureStore({
    reducer: {
        account: accountSlice
    }
})