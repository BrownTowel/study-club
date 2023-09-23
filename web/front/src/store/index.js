import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './auth';
import websocketSlice from './websocket';

export default configureStore({
    reducer: {
        account: accountSlice,
        websocket: websocketSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['websocket/connection'],
            // // Ignore these field paths in all actions
            // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // // Ignore these paths in the state
            // ignoredPaths: ['items.dates'],
            ignoredPaths: ['websocket.connection'],
        },
        }),
})