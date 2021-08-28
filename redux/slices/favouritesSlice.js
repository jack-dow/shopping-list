import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase, useQuery } from '../../lib/initSupabase';
import { fetchProductByStockcode, fetchProductsByStockcode } from '../services/woolworths';

export const fetchAllFavourites = createAsyncThunk(
  'favourites/fetchAllFavourites',
  async (props) => {
    let favourites;
    if (props?.filterValue) {
      favourites = await useQuery(
        supabase
          .from('favourites')
          .select('*')
          .order('name')
          .ilike('name', `%${props.filterValue}%`)
      );
    } else {
      favourites = await useQuery(supabase.from('favourites').select('*').order('name'));
    }
    if (props?.withData) {
      return fetchProductsByStockcode(favourites);
    }
    return favourites;
  }
);

// Insert new item into the database
export const addFavourite = createAsyncThunk('favourites/addFavourite', async (props, thunkAPI) => {
  if (!props) return null;
  const state = thunkAPI.getState();
  const { list } = state.user.user;
  const [existingFavourite] = await useQuery(
    supabase.from('favourites').select('*').match({ stockcode: props?.stockcode, list })
  );

  if (!existingFavourite) {
    const [data] = await useQuery(supabase.from('favourites').insert([{ ...props, list }]));
    if (props?.withData) {
      const itemWithData = await fetchProductByStockcode(data);
      return itemWithData;
    }
    return data;
  }

  return existingFavourite;
});

// Delete an item from the database
export const deleteFavourite = createAsyncThunk('favourites/deleteFavourite', async (stockcode) => {
  const [data] = await useQuery(supabase.from('favourites').delete().match({ stockcode }));
  if (!data) return { stockcode };
  return data;
});

export const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: { favourites: null },
  reducers: {
    clearFavourites: (state) => {
      state.favourites = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllFavourites.fulfilled, (state, action) => {
      state.favourites = action.payload;
    });
    builder.addCase(addFavourite.fulfilled, (state, action) => {
      if (action.payload) state.favourites = [...state.favourites, action.payload];
    });
    builder.addCase(deleteFavourite.fulfilled, (state, action) => {
      state.favourites = state.favourites.filter((item) => item.id !== action.payload.id);
    });
  },
});

// Action creators are generated for each case reducer function
export const { clearFavourites } = favouritesSlice.actions;

export default favouritesSlice.reducer;
