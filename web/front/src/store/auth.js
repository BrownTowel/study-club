import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    permissions: null
  },
  reducers: {
    setAuth: ( state, action ) => {

      state.user = action.payload.user;
      state.permissions = action.payload.permissions;

      // localStorage.setItem("auth_token", action.payload.token);
    }
  }
});

// Action creators are generated for each case reducer function
export const { setAuth } = accountSlice.actions;

export default accountSlice.reducer
