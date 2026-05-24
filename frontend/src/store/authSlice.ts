import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    toggleSavedJob: (state, action: PayloadAction<string>) => {
      if (state.user) {
        if (!state.user.savedJobs) state.user.savedJobs = [];
        const index = state.user.savedJobs.indexOf(action.payload);
        if (index > -1) {
          state.user.savedJobs.splice(index, 1);
        } else {
          state.user.savedJobs.push(action.payload);
        }
      }
    },
  },
});

export const { setCredentials, logout, setInitialized, toggleSavedJob } = authSlice.actions;
export default authSlice.reducer;
