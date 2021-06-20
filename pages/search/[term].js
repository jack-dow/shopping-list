import { PlusIcon, MinusIcon } from '@heroicons/react/solid';
import { SearchIcon } from '@iconicicons/react';
import axios from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';

import Layout from '../../components/Layout';
import Toast from '../../components/Toast';

import { addProduct, deleteProduct, fetchProducts } from '../../lib/Store';

const SearchTerm = () => {
  const router = useRouter();
  const { term } = router.query;

  const [shoppingList, setShoppingList] = useState([]);
  const [products, setProducts] = useState();
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchProducts(setShoppingList);
  }, []);

  useEffect(async () => {
    if (term !== undefined) {
      const { data } = await axios.get(
        `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${term}&pageSize=36`
      );
      if (data.Products?.length > 0) {
        setProducts(data.Products);
      } else {
        setProducts([]);
      }
      setLoadedProducts(true);
    }
  }, [term]);

  if (!term || !loadedProducts) return <div />;

  return (
    <Layout>
      <div className="pt-2 h-full flex flex-col bg-light-blue-600">
        <div className="px-4">
          <div className="flex pt-4 py-2">
            <p className="text-3xl pr-2">🔍</p>
            <div>
              <p className="font-medium text-gray-200 leading-3">Results for</p>
              <p className="text-3xl font-bold text-white sm:text-2xl">&quot;{term}&quot;</p>
            </div>
          </div>
          <form
            className="w-full flex pb-6"
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/search/[term]', `/search/${searchValue}`, { shallow: true });
            }}
          >
            <label htmlFor="search_field" className="sr-only">
              Search
            </label>
            <div className="text-true-gray-500 focus-within:text-true-gray-300 transition w-full">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  className="shadow-sm border-none py-4 pl-10 bg-gray-100 rounded-lg w-full text-gray-600 focus:ring-2 focus:ring-light-blue-600 dark:focus:border-light-blue-700 transition"
                  placeholder="Search for any product"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="space-y-4 flex-1 p-4 pb-12 bg-gray-100 rounded-t-3xl">
          <div className="bg-white shadow h-full rounded-t-3xl grid grid-cols-2 p-4">
            {!loadedProducts || products?.length > 0 ? (
              products?.map(({ Products }, index) => {
                const [product] = Products;
                return (
                  <Product
                    index={index}
                    key={product.Stockcode}
                    product={product}
                    shoppingList={shoppingList}
                    setShoppingList={setShoppingList}
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-center col-span-2">
                <img src="/not_found.png" alt="Not found art" className="pb-4" />
                <h2 className="text-gray-900 text-2xl">No products found 😳</h2>
              </div>
            )}
            {loadedProducts &&
              products.length < 4 &&
              [...Array(4 - products.length)].map(() => <div className="h-full" />)}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchTerm;

const Product = ({ product, shoppingList, setShoppingList, index }) => {
  const [onShoppingList, setOnShoppingList] = useState(
    shoppingList.some((item) => item.stockcode === product.Stockcode)
  );

  const newProduct = {
    name: product.Name,
    stockcode: product.Stockcode,
    price: product.Price,
    image: product.MediumImageFile,
    cupstring: product.CupString,
  };

  return (
    <div
      key={product.Stockcode}
      className={classNames('flex relative flex-col pb-4 space-y-3 border-b border-gray-100', {
        'pl-4 border-l': index % 2 === 1,
        'pr-4': index % 2 === 0,
        'pt-4': index > 1,
        'pointer-events-none': !product.IsAvailable,
      })}
    >
      {!product.IsAvailable && (
        <Fragment>
          <div className="absolute z-20 flex items-center justify-center inset-0">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-md font-medium bg-pink-100 text-pink-800">
              Unavailable
            </span>{' '}
          </div>
          <div className="absolute bg-white opacity-50  inset-0 z-10" />
        </Fragment>
      )}
      <div className="flex items-center justify-center">
        <img src={product.SmallImageFile} alt={product.Name} />
      </div>
      <div className="flex flex-col">
        <div className="">
          <p className="text-gray-900 font-medium leading-7 line-clamp-2">{product.Name}</p>
          <p className="text-xs text-true-gray-400 opacity-80 lowercase">{product.CupString}</p>
        </div>
        <p className="text-light-blue-600 font-medium leading-8">
          $
          {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
            .format(product.Price)
            .substring(1)}
        </p>
      </div>
      <div
        className={classNames('absolute bottom-0', {
          'right-0': index % 2 === 0,
          '-right-4': index % 2 === 1,
        })}
      >
        <button
          type="button"
          className={`w-9 h-9 text-white p-2 rounded-tl-3xl ${
            onShoppingList ? 'bg-red-600' : 'bg-light-blue-600'
          } focus:outline-none transition duration-200`}
          onClick={() => {
            console.log(product);
            if (!onShoppingList) {
              addProduct(newProduct);
              setShoppingList([...shoppingList, newProduct]);
              setOnShoppingList(true);
              Toast({ text: `Added "${product.Name}" to the list` });
            } else {
              deleteProduct(product.Stockcode);
              setShoppingList(
                shoppingList.filter((currProduct) => currProduct.stockcode !== newProduct.stockcode)
              );
              setOnShoppingList(false);
              Toast({ text: `Removed "${product.Name}" from the list` });
            }
          }}
        >
          <PlusIcon
            className={classNames('w-5 h-5 absolute inset-y-0 top-1/4 left-1/4 transition', {
              'opacity-100': !onShoppingList,
              'opacity-0': onShoppingList,
            })}
          />

          <MinusIcon
            className={classNames('w-5 h-5 absolute inset-y-0 top-1/4 left-1/4 transition', {
              'opacity-100': onShoppingList,
              'opacity-0': !onShoppingList,
            })}
          />
        </button>
      </div>
    </div>
  );
};
