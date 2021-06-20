import { useEffect, useState } from 'react';
import { supabase } from '../Store';

const getProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('shopping_list').select('*');
      setProducts(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchProducts();

    const productListener = supabase
      .from('shopping_list')
      .on('INSERT', (payload) => setNewProduct(payload.new))
      .on('DELETE', (payload) => setDeleteProduct(payload.old))
      .subscribe();

    return () => {
      productListener.unsubscribe();
      supabase.removeSubscription(productListener);
    };
  }, []);

  useEffect(() => {
    if (newProduct) setProducts(products.concat(newProduct));
  }, [newProduct]);

  useEffect(() => {
    if (deleteProduct) setProducts(products.filter((product) => product.id !== deleteProduct.id));
  }, [deleteProduct]);

  return products;
};

export default getProducts;
