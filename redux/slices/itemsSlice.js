import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase, useQuery } from '../../lib/initSupabase';
import { fetchProductByStockcode, fetchProductsByStockcode } from '../services/woolworths';
import { addHistory } from './historySlice';

export const fetchAllItems = createAsyncThunk('items/fetchAllItems', async (withData) => {
  withData = !!withData;

  const data = await useQuery(supabase.from('list_items').select('*').order('name'));

  if (withData) {
    return fetchProductsByStockcode(data);
  }

  return data;
});

// Insert new item into the database
export const addItem = createAsyncThunk('items/addItem', async ({ item, withData }, thunkAPI) => {
  withData = !!withData;
  const state = thunkAPI.getState();
  const { user } = state.user;
  const [existingItem] = await useQuery(
    supabase
      .from('list_items')
      .select('*')
      .match({ ...item, list: user.list })
  );

  if (!existingItem) {
    const [data] = await useQuery(
      supabase.from('list_items').insert([{ ...item, list: user.list }])
    );
    if (withData) {
      const itemWithData = await fetchProductByStockcode(data);
      return itemWithData;
    }
    thunkAPI.dispatch(
      addHistory({
        event: 'create',
        user: user.id,
        stockcode: data.stockcode,
        name: data.name,
        list: user.list,
      })
    );
    return data;
  }

  const action = await thunkAPI.dispatch(
    editItemQuantity({ id: existingItem.id, quantity: existingItem.quantity + 1 })
  );

  return action.payload;
});

// Delete an item from the database
export const deleteItem = createAsyncThunk('items/deleteItem', async (id, thunkAPI) => {
  const [data] = await useQuery(supabase.from('list_items').delete().match({ id }));
  if (!data) return { id };
  const state = thunkAPI.getState();
  const { user } = state.user;
  thunkAPI.dispatch(
    addHistory({
      event: 'delete',
      user: user.id,
      stockcode: data.stockcode,
      name: data.name,
      list: data.list,
    })
  );
  return data;
});

// Enter the quantity of an item
export const editItemQuantity = createAsyncThunk(
  'items/editItemQuantity',
  async ({ id, quantity }, thunkAPI) => {
    if (quantity > 0) {
      const [data] = await useQuery(supabase.from('list_items').update({ quantity }).match({ id }));
      // handleUpdatedItem(data);
      return data;
    }

    const action = await thunkAPI.dispatch(deleteItem(id));
    return action.payload;
  }
);

export const itemsSlice = createSlice({
  name: 'items',
  initialState: { items: null },
  reducers: {
    clearItems: (state) => {
      state.items = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      if (action.payload) state.items = [...state.items, action.payload];
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    });
    builder.addCase(editItemQuantity.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        );
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const { clearItems } = itemsSlice.actions;

export default itemsSlice.reducer;
