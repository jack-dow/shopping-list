import { useEffect, useState } from 'react';

import { supabase, useQuery } from '../Store';
import { fetchItemProductData } from './useProducts';

// Returns only the array of stockcodes that are on the list
export const fetchItems = async (setState) => {
  const items = await useQuery(supabase.from('list_items').select('*'));

  if (setState) setState(items);
  return items;
};

// Returns a list of the items with their product data from woolworths API
export const fetchItemsWithData = async (setState) => {
  const items = await fetchItemProductData(await fetchItems());

  if (setState) setState(items);
  return items;
};

// Insert new item into the database
export const addItem = async (item, list) => {
  const [alreadyExists] = await useQuery(
    supabase
      .from('list_items')
      .select('*')
      .match({ ...item, list })
      .limit(1)
  );

  if (!alreadyExists) {
    const [data] = await useQuery(supabase.from('list_items').insert([{ ...item, list }]));
    const user = supabase.auth.user();
    await useQuery(
      supabase
        .from('history')
        .insert([
          { event: 'create', user: user.id, stockcode: data.stockcode, name: data.name, list },
        ])
    );
    return data;
  }

  const data = await editItemQuantity(alreadyExists.id, alreadyExists.quantity + 1);
  return data;
};

// Delete an item from the database
export const deleteItem = async (id) => {
  const data = await useQuery(supabase.from('list_items').delete().match({ id }).single());

  const user = supabase.auth.user();
  await useQuery(
    supabase.from('history').insert([
      {
        event: 'delete',
        user: user.id,
        stockcode: data.stockcode,
        name: data.name,
        list: data.list,
      },
    ])
  );
  return data;
};

// Enter the quantity of an item
export const editItemQuantity = async (id, quantity) => {
  if (quantity === 0) {
    const data = await deleteItem(id);
    return { ...data, deleted: true };
  }
  const [data] = await useQuery(supabase.from('list_items').update({ quantity }).match({ id }));
  return data;
};

export function useItems(withData) {
  const [items, setItems] = useState(null);
  const [newItem, handleNewItem] = useState(null);
  const [updatedItem, handleUpdatedItem] = useState(null);
  const [deletedItem, handleDeletedItem] = useState(null);

  // Load initial data and set up listeners
  useEffect(() => {
    // Get items from database
    if (withData) {
      fetchItemsWithData(setItems);
    } else {
      fetchItems(setItems);
    }

    // Listen for new, deleted and updated items to the shopping list
    let itemListener = null;

    // Set timeout to ensure there is no conflict between listeners
    setTimeout(() => {
      itemListener = supabase
        .from('list_items')
        .on('INSERT', (payload) => handleNewItem(payload.new))
        .on('UPDATE', (payload) => handleUpdatedItem(payload.new))
        .on('DELETE', (payload) => handleDeletedItem(payload.old))
        .subscribe();
    }, 50);

    return () => {
      supabase.removeSubscription(itemListener);
    };
  }, []);

  // Handle new item being added to the list
  useEffect(() => {
    async function loadItemData() {
      const data = await fetchItemProductData([newItem]);
      if (data?.length > 0) setItems([...items, data[0]]);
    }

    if (newItem) {
      if (withData) {
        loadItemData();
      } else {
        setItems([...items, newItem]);
      }
    }
  }, [newItem]);

  // Handle item being deleted from the list
  useEffect(() => {
    if (deletedItem) setItems(items.filter((item) => item.stockcode !== deletedItem.stockcode));
  }, [deletedItem]);

  useEffect(() => {
    if (updatedItem) {
      setItems(
        items.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
      );
    }
  }, [updatedItem]);

  return {
    items,
  };
}
