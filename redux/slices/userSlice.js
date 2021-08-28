import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase, useQuery } from '../../lib/initSupabase';

export const fetchUser = createAsyncThunk('user/fetchCurrentUser', async (userId) => {
  if (!userId) return null;
  const [user] = await useQuery(supabase.from('users').select('*').match({ id: userId }));
  return user;
});

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async () => {
  const users = await useQuery(supabase.from('users').select('*'));
  return users;
});

export const userSlice = createSlice({
  name: 'user',
  initialState: { session: null, user: null, isAuthenticated: null, users: null },
  reducers: {
    logout: (state) => {
      supabase.auth.signOut();
      state.session = null;
      state.user = null;
      state.isAuthenticated = null;
    },
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { logout, setSession, setIsAuthenticated } = userSlice.actions;

export default userSlice.reducer;
