import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { supabase, useQuery } from '../../lib/initSupabase';

export const fetchAllHistory = createAsyncThunk('history/fetchAllHistory', async () => {
  const data = await useQuery(
    supabase.from('history').select('*').order('created_at', { ascending: false }).limit(20)
  );

  const history = [];
  // Organise the events into their correct date categories
  data.forEach((item) => {
    const existingDate = history.find(
      ({ date }) => date === dayjs(item.createdAt).format('YYYY-MM-DD')
    );
    if (existingDate) {
      existingDate.history.push(item);
    } else {
      history.push({ date: dayjs(item.createdAt).format('YYYY-MM-DD'), history: [item] });
    }
  });

  return history;
});

// Insert new history entry into the database
export const addHistory = createAsyncThunk('history/addHistory', async (event) => {
  const [data] = await useQuery(supabase.from('history').insert([event]));

  return data;
});

export const historySlice = createSlice({
  name: 'history',
  initialState: { history: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllHistory.fulfilled, (state, action) => {
      state.history = action.payload;
    });
    builder.addCase(addHistory.fulfilled, (state, action) => {
      if (action.payload) {
        if (Array.isArray(state.history)) {
          state.history = [...state.history, action.payload];
        } else {
          state.history = [action.payload];
        }
      }
    });
  },
});

// Action creators are generated for each case reducer function
// export const { clearItems } = historySlice.actions;

export default historySlice.reducer;
