import axios from 'axios';
import { pascalToCamelCase } from '../../utils/caseTransform';

// Fetch the item product data from woolworths API for the provided stockcodes.
export const fetchItemProductData = async (items, setState) => {
  if (items?.length > 0) {
    const stockcodes = items.map(({ stockcode }) => stockcode);
    const products = [];

    const { data } = await axios.get(
      `https://www.woolworths.com.au/apis/ui/products/${stockcodes.join(',')}`
    );

    const productData = pascalToCamelCase(data);

    if (productData?.length > 0) {
      productData.forEach((productInfo, index) => {
        if (items[index].id) {
          products.push({
            ...productInfo,
            id: items[index].id,
            quantity: items[index].quantity || 0,
          });
        }
      });
    }

    if (setState) setState(products);
    return products;
  }

  return [];
};

export const fetchProductsFromSearch = async (searchTerm, setState, setPages, pageNumber) => {
  const { data } = await axios.get(
    `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${searchTerm}&pageSize=12&pageNumber=${
      pageNumber || '1'
    }`
  );

  if (data.Products) {
    const productData = data.Products.map(({ Products }) => pascalToCamelCase(Products[0]));
    if (setState) setState(productData);
    if (setPages) setPages(Math.ceil(data.SearchResultsCount / 12));
    return {
      products: productData,
      numOfPages: Math.ceil(data.SearchResultsCount / 12),
    };
  }
  if (setState) setState([]);
  if (setPages) setPages(0);
  return {
    products: [],
    numOfPages: 0,
  };
};

export const fetchDetailedProduct = async (stockcode, setState) => {
  try {
    if (stockcode) {
      const { data } = await axios.get(
        `https://www.woolworths.com.au/apis/ui/product/${stockcode}`
      );
      const camelCasedData = pascalToCamelCase(data);
      if (setState) setState(camelCasedData);
      return camelCasedData;
    }
    return null;
  } catch (error) {
    return [];
  }
};
