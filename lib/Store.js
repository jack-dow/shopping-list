/* eslint-disable no-use-before-define */
import { CheckCircleIcon } from '@heroicons/react/solid';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import { snakeToCamelCase } from '../utils/caseTransform';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const useStore = () => {
  const [products, setProducts] = useState(null);
  const [newProduct, handleNewProduct] = useState(null);
  const [deletedProduct, handleDeletedProduct] = useState(null);

  // Load initial data and set up listeners
  useEffect(() => {
    //   Get products
    fetchProducts(setProducts);

    // Listen for new and deleted products to the shopping list
    const productListener = supabase
      .from('shopping_list')
      .on('INSERT', (payload) => handleNewProduct(payload.new))
      .on('DELETE', (payload) => handleDeletedProduct(payload.old))
      .subscribe();

    // Cleanup on unmount
    return () => supabase.removeSubscription(productListener);
  }, []);

  // New product recieved from database
  useEffect(() => {
    if (newProduct) setProducts(products.concat(newProduct));
  }, [newProduct]);

  // Deleted product received from database
  useEffect(() => {
    if (deletedProduct) setProducts(products.filter((product) => product.id !== deletedProduct.id));
  }, [deletedProduct]);

  return {
    products,
  };
};

const useQuery = async (query) => {
  const { body, error } = await query;

  if (error) {
    console.log('error', error);
    Toast({
      title: 'An error occured.',
      text: 'Check console for more information.',
      icon: <CheckCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />,
    });

    return null;
  }

  return snakeToCamelCase(body);
};

// Fetch all products from shopping list
export const fetchProducts = async (setState) => {
  const data = await useQuery(supabase.from('shopping_list').select('*'));
  if (setState) setState(data);

  return data;
};

// Insert a new product into the database
export const addProduct = async (product) => {
  const data = await useQuery(supabase.from('shopping_list').insert([product]));
  return data;
};

// Delete a product from the database
export const deleteProduct = async (stockcode) => {
  const data = await useQuery(supabase.from('shopping_list').delete().match({ stockcode }));
  return data;
};
