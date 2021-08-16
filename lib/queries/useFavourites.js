import { useEffect, useState } from 'react';
import { supabase, useQuery } from '../Store';
import { fetchItemProductData } from './useProducts';

// Fetch favourites stockcodes from db
export const fetchFavourites = async (setState, filterValue) => {
  let data;
  if (filterValue) {
    data = await useQuery(
      supabase.from('favourites').select('*').order('name').ilike('name', `%${filterValue}%`)
    );
  } else {
    data = await useQuery(supabase.from('favourites').select('*').order('name'));
  }

  if (setState) setState(data);
  return data;
};

// Fetch favourites with data from woolworths API
export const fetchFavouritesWithData = async (setState, filterValue) => {
  const favourites = await fetchItemProductData(await fetchFavourites(null, filterValue));

  if (setState) setState(favourites);
  return favourites;
};

export const addFavourite = async (stockcode, name, list) => {
  const data = await useQuery(supabase.from('favourites').insert([{ stockcode, name, list }]));
  return data;
};

export const deleteFavourite = async (stockcode, list) => {
  const data = await useQuery(supabase.from('favourites').delete().match({ stockcode, list }));
  return data;
};

export function useFavourites(withData, filterValue) {
  const [favourites, setFavourites] = useState(null);
  const [newFavourite, handleNewFavourite] = useState(null);
  const [deletedFavourite, handleDeletedFavourite] = useState(null);

  // Load initial data and set up listeners
  useEffect(() => {
    // Get items from database
    if (withData) {
      fetchFavouritesWithData(setFavourites, filterValue);
    } else {
      fetchFavourites(setFavourites, filterValue);
    }

    // Listen for new, deleted and updated items to the shopping list
    let favouritesListener = null;

    // Set timeout to ensure there is no conflict between listeners
    setTimeout(() => {
      favouritesListener = supabase
        .from('favourites')
        .on('INSERT', (payload) => handleNewFavourite(payload.new))
        .on('DELETE', (payload) => handleDeletedFavourite(payload.old))
        .subscribe();
    }, 50);

    return () => {
      supabase.removeSubscription(favouritesListener);
    };
  }, []);

  useEffect(() => {
    setFavourites(null);
    if (withData) {
      fetchFavouritesWithData(setFavourites, filterValue);
    } else {
      fetchFavourites(setFavourites, filterValue);
    }
  }, [filterValue]);

  // Handle new item being added to the list
  useEffect(() => {
    async function loadItemData() {
      const data = await fetchItemProductData([newFavourite]);
      if (data?.length > 0)
        setFavourites([...favourites, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
    }

    if (newFavourite && (!filterValue || newFavourite.name.includes(filterValue))) {
      if (withData) {
        loadItemData();
      } else {
        setFavourites([...favourites, newFavourite].sort((a, b) => a.name.localeCompare(b.name)));
      }
    }
  }, [newFavourite]);

  // Handle item being deleted from the list
  useEffect(() => {
    if (deletedFavourite) {
      setFavourites(
        favourites.filter((favourite) => favourite.stockcode !== deletedFavourite.stockcode)
      );
    }
  }, [deletedFavourite]);

  return {
    favourites,
  };
}
