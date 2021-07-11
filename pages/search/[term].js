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

import { addProduct, deleteProduct, fetchProducts } from '../../lib/Store';
import withAuthentication from '../../HOCs/withAuthentication';

const SearchTerm = () => {
  const router = useRouter();

  const { initialTerm } = router.query;

  const [products, setProducts] = useState();
  const [term, setTerm] = useState(initialTerm || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);

  const [shoppingList, setShoppingList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  async function fetchResults(searchTerm) {
    const { data } = await axios.get(
      `https://www.woolworths.com.au/apis/ui/Search/products?searchTerm=${searchTerm}&pageSize=12`
    );
    if (data.Products) {
      setNumOfPages(Math.ceil(data.SearchResultsCount / 12));
      setProducts(data.Products);
    } else {
      setProducts([]);
    }
    return data;
  }

  useEffect(() => {
    fetchProducts(setShoppingList);
  }, []);

  useEffect(() => {
    if (initialTerm) {
      fetchResults(initialTerm);
    }
  }, [initialTerm]);

  useEffect(() => {
    setProducts();
    setCurrentPage(1);
    setTerm(router.query.term);
    fetchResults(router.query.term);
  }, [router.query.term]);

  return (
    <Layout>
      <div className="px-4 pt-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <p className="text-3xl pr-2">🔍</p>
            <div className="truncate">
              <p className="font-medium text-gray-600 leading-4">
                {term ? 'Results for' : 'Find exactly'}
              </p>
              <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">
                {term ? `"${term}"` : 'What you need'}
              </p>
            </div>
          </div>
          <form
            className="w-full flex pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search/${searchValue}`);
            }}
          >
            <label htmlFor="search_field" className="sr-only">
              Search
            </label>
            <div className="text-true-gray-500 focus-within:text-true-gray-300 transition w-full">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <SearchIcon className="w-7 h-7" />
                </div>

                <input
                  type="text"
                  className="shadow-sm border-none py-4 pl-10 bg-white rounded-lg w-full text-gray-600 focus:ring-2 focus:ring-sky-600 transition"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>

        <Transition
          appear
          show={!Array.isArray(products)}
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="grid grid-cols-2 gap-4"
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={classNames(
                'flex relative flex-col pb-4 space-y-3 bg-white rounded-2xl p-3 shadow',
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

        <Transition
          show={products?.length > 0}
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="grid grid-cols-2 gap-4"
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
      {products?.length === 0 && (
        <div className="pt-3 flex flex-col items-center space-y-8">
          <div className="flex items-center justify-center mx-auto">
            <img src="/empty.svg" alt="Drawing of man holding an empty box" className="h-52" />
          </div>
          <div className="relative mx-6">
            <p className="text-center text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Whoops. No product &quot;{term}&quot; could be found
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-center text-gray-500">
              Check your spelling or enter a new term into the search bar
            </p>
          </div>
        </div>
      )}
      {products && (
        <nav className="border-t border-gray-200 mt-4 pb-2 px-4 flex items-center justify-between sm:px-0">
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
    </Layout>
  );
};

export default withAuthentication(SearchTerm);

const Product = ({ product, shoppingList, setShoppingList }) => {
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
      className={classNames('flex relative flex-col space-y-3 bg-white rounded-2xl p-3 shadow', {
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
        <img src={product.SmallImageFile} alt={product.Name} className="w-30 h-30" />
      </div>
      <div className="flex flex-col">
        <div className="">
          <p className="text-gray-900 font-medium leading-6 line-clamp-2">{product.Name}</p>
          <p className="text-xs text-true-gray-400 opacity-80 lowercase">{product.CupString}</p>
        </div>
        <p className="text-sky-600 font-medium leading-8">
          $
          {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
            .format(product.Price)
            .substring(1)}
        </p>
      </div>
      <div className="absolute bottom-0 right-0">
        {product.IsAvailable && (
          <button
            type="button"
            className={`w-9 h-9 text-white p-2 rounded-tl-3xl ${
              onShoppingList ? 'bg-red-600' : 'bg-sky-600'
            } focus:outline-none transition duration-200`}
            onClick={() => {
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
