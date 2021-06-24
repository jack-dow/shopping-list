/* eslint-disable react/no-array-index-key */
import {
  PlusIcon,
  MinusIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/solid';
import { SearchIcon } from '@iconicicons/react';
import axios from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';

import Layout from '../../components/Layout';
import Toast from '../../components/Toast';

import { addProduct, deleteProduct, fetchProducts } from '../../lib/Store';

const SearchTerm = ({ term: initialTerm }) => {
  const router = useRouter();

  const [products, setProducts] = useState();
  const [term, setTerm] = useState(initialTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);

  const [shoppingList, setShoppingList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(async () => {
    fetchProducts(setShoppingList);
    if (!products) {
      const { data } = await axios.get(
        `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${term}&pageSize=12`
      );

      if (data.Products) {
        setNumOfPages(Math.ceil(data.SearchResultsCount / 12));
        setProducts(data.Products);
      } else {
        setProducts([]);
      }
    }
  }, []);

  useEffect(async () => {
    setProducts();
    setCurrentPage(1);
    setTerm(router.query.term);
    const { data } = await axios.get(
      `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${router.query.term}&pageSize=12`
    );
    if (data.Products) {
      setNumOfPages(Math.ceil(data.SearchResultsCount / 12));
      setProducts(data.Products);
    } else {
      setProducts([]);
    }
  }, [router.query.term]);

  return (
    <Layout>
      <div className="pt-4 h-full flex flex-col bg-light-blue-600">
        <div className="px-4">
          <div className="flex pt-4 py-2">
            <p className="text-3xl pr-2">🔍</p>
            <div className="truncate">
              <p className="font-medium text-gray-200 leading-3">
                {term ? 'Results for' : 'Find exactly'}
              </p>
              <p className="text-3xl font-bold text-white sm:text-2xl truncate">
                {term ? `"${term}"` : 'What you need'}
              </p>
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
        <div className="space-y-4 flex-1 p-4 pb-8 bg-gray-100 rounded-t-3xl">
          <div className="bg-white shadow  rounded-t-3xl">
            <Transition
              appear
              show={!Array.isArray(products)}
              enter="transition ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="grid grid-cols-2 p-4"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={classNames(
                    'flex relative flex-col pb-4 space-y-3 border-b border-gray-100',
                    {
                      'pl-4 border-l': index % 2 === 1,
                      'pr-4': index % 2 === 0,
                      'pt-4': index > 1,
                    }
                  )}
                >
                  <div className="animate-pulse bg-gray-100 mx-auto w-30 h-30" />

                  <div className="w-10/12 bg-gray-300 animate-pulse h-4" />
                  <div className="w-1/2 bg-gray-100 animate-pulse h-3" />
                  <div className="w-1/3 bg-gray-300 animate-pulse h-4" />
                  <div
                    className={classNames(
                      'absolute bottom-0 h-9 w-9 bg-gray-300 rounded-tl-3xl animate-pulse',
                      {
                        'right-0': index % 2 === 0,
                        '-right-4': index % 2 === 1,
                      }
                    )}
                  />
                </div>
              ))}
            </Transition>
            {products?.length === 0 && (
              <div className="flex flex-col items-center col-span-2 pb-8">
                <img src="/not_found.png" alt="Not found art" className="pb-4 rounded-t-3xl" />
                <h2 className="text-gray-900 text-2xl">No products found 😳</h2>
              </div>
            )}
            <Transition
              show={products?.length > 0}
              enter="transition ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="grid grid-cols-2 p-4"
            >
              {products?.map(({ Products }, index) => {
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
              })}
            </Transition>
          </div>
          {products && (
            <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 pb-16">
              <div className="-mt-px w-0 flex-1 flex">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={async () => {
                    setProducts();
                    const { data } = await axios.get(
                      `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${
                        router.query.term
                      }&pageSize=12&pageNumber=${currentPage - 1}`
                    );
                    setCurrentPage(currentPage - 1);
                    setProducts(data.Products);
                  }}
                  className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 focus:outline-none transition disabled:opacity-50 disabled:text-gray-500 disabled:border-transparent"
                >
                  <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Previous
                </button>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{numOfPages}</span>{' '}
                </p>
              </div>
              <div className="-mt-px w-0 flex-1 flex justify-end">
                <button
                  type="button"
                  disabled={currentPage === numOfPages}
                  onClick={async () => {
                    setProducts();
                    const { data } = await axios.get(
                      `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${
                        router.query.term
                      }&pageSize=12&pageNumber=${currentPage + 1}`
                    );
                    setCurrentPage(currentPage + 1);
                    setProducts(data.Products);
                  }}
                  className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 focus:outline-none transition disabled:opacity-50 disabled:text-gray-500 disabled:border-transparent"
                >
                  Next
                  <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { term } = context.params;

  return {
    props: { term }, // will be passed to the page component as props
  };
}

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
        {product.IsAvailable && (
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
              } else {
                deleteProduct(product.Stockcode);
                setShoppingList(
                  shoppingList.filter(
                    (currProduct) => currProduct.stockcode !== newProduct.stockcode
                  )
                );
                setOnShoppingList(false);
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
        )}
      </div>
    </div>
  );
};
