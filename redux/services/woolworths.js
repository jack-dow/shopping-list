import axios from 'axios';
import { pascalToCamelCase } from '../../utils/caseTransform';

const baseUrl = 'https://www.woolworths.com.au/apis/ui/';

// Fetch the item product data from woolworths API for the provided stockcodes.
export const fetchProductsByStockcode = async (items) => {
  try {
    if (items?.length > 0) {
      const stockcodes = items.map(({ stockcode }) => stockcode);
      const { data } = await axios.get(`${baseUrl}products/${stockcodes.join(',')}`);

      if (data?.length > 0) {
        const products = pascalToCamelCase(data);
        items.forEach(({ stockcode }, index) => {
          const product = products.find((prod) => stockcode === prod.stockcode);
          if (product) items[index] = { ...product, ...items[index] };
        });
      }

      return items;
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchProductByStockcode = async (item) => {
  try {
    if (item) {
      const { data } = await axios.get(`${baseUrl}product/${item.stockcode}`);
      const camelCasedData = pascalToCamelCase(data);

      return { ...camelCasedData, ...item };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchProductsFromSearch = async (searchProps, stateChanges) => {
  const { searchTerm, pageNumber, sortOrder } = searchProps;
  const { setProducts, setProductCount } = stateChanges;
  const { data } = await axios.get(
    `${baseUrl}Search/products?searchTerm=${searchTerm}&pageSize=12&pageNumber=${
      pageNumber || '1'
    }&sortType=${sortOrder}`
  );

  if (data.Products) {
    console.log(data);
    const productData = data.Products.map(({ Products }) => pascalToCamelCase(Products[0]));
    if (setProducts) setProducts(productData);
    if (setProductCount) setProductCount(data.SearchResultsCount);
    return {
      products: productData,
      productCount: data.SearchResultsCount,
    };
  }

  if (setProducts) setProducts([]);
  if (setProductCount) setProductCount(0);
  return {
    products: [],
    productCount: 0,
  };
};
