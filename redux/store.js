import { configureStore } from '@reduxjs/toolkit';

import favouritesReducer from './slices/favouritesSlice';
import historyReducer from './slices/historySlice';
import itemsReducer from './slices/itemsSlice';
import userReducer from './slices/userSlice';

export default configureStore({
  reducer: {
    favourites: favouritesReducer,
    history: historyReducer,
    items: itemsReducer,
    user: userReducer,
  },
});

export const sortProductsByName = (items) => {
  const sortedItems = [...items];
  sortedItems.sort((a, b) => {
    const aName = a.brand ? a.name.replace(`${a.brand} `, '') : a.name;
    const bName = b.brand ? b.name.replace(`${b.brand} `, '') : b.name;
    const result = aName < bName ? -1 : 1;
    return result;
  });
  return sortedItems;
};
