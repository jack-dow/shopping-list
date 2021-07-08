/* eslint-disable react/no-array-index-key */
import { TrashIcon } from '@heroicons/react/outline';
import { SearchIcon } from '@iconicicons/react';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import Toast from '../components/Toast';
import { addProduct, deleteProduct, useStore } from '../lib/Store';
import { UserContext } from '../lib/UserContext';
import withAuthentication from '../HOCs/withAuthentication';

const Home = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const { products } = useStore();

  const names = [user.name, ...user.nicknames];

  return (
    <Layout>
      <NextSeo
        title="Shopping List | TKIT"
        description="The TKIT shopping list is the best way to family your families shopping list."
      />
      <div className="px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <p className="text-3xl pr-2">👋</p>
            <div className="truncate">
              <p className="font-medium text-gray-600 leading-4">G&apos;Day</p>
              <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">
                {names[Math.floor(Math.random() * names.length)]}
              </p>
            </div>
          </div>
          <form
            className="w-full flex pb-4"
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
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <SearchIcon className="w-7 h-7" />
                </div>

                <input
                  type="text"
                  className="shadow-sm border-none py-4 pl-10 bg-white rounded-lg w-full text-gray-600 focus:ring-2 focus:ring-sky-600 dark:focus:border-sky-700 transition"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
        <Transition
          show={products?.length > 0}
          appear
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="space-y-3"
        >
          {products?.map((product) => (
            <div
              className={classNames(
                'p-3 rounded-2xl bg-white shadow flex items-center justify-center',
                {}
              )}
              key={product.id}
            >
              <div className="flex items-center justify-center overflow-hidden w-24 h-24">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full w-full h-full"
                />
              </div>
              <div className="pl-3 flex-1 flex flex-col">
                <div className="flex-1 ">
                  <p className="text-gray-900 font-semibold leading-5 pb-1 line-clamp-2">
                    {product.name}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-medium text-true-gray-400">{product.cupstring}</p>
                    <p className="text-sky-600 font-medium">
                      $
                      {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                        .format(product.price)
                        .substring(1)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteProduct(product.stockcode);
                      Toast({
                        title: `Removed "${product.name}" from the list.`,
                        undo: () => addProduct(product),
                      });
                    }}
                    className="flex items-center justify-center text-red-600 border w-8 h-8 border-red-600 rounded-md hover:bg-red-600 hover:text-red-50 focus:bg-red-600 focus:text-red-50 focus:outline-none transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Transition>
        {products?.length === 0 && (
          <div className="pt-3 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mx-auto">
              <img src="/celebration.svg" alt="Drawing of two beers clinking" className="h-72" />
            </div>
            <div>
              <p className="mt-8 text-center text-2xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-4xl">
                The list is empty 🥳
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withAuthentication(Home);
