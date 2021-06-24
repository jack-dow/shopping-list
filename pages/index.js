/* eslint-disable react/no-array-index-key */
import { TrashIcon, UserCircleIcon } from '@heroicons/react/outline';
import { SearchIcon } from '@iconicicons/react';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';

import Layout from '../components/Layout';
import Toast from '../components/Toast';
import { addProduct, deleteProduct, useStore } from '../lib/Store';
import Dropdown, { DropdownButton } from '../components/Dropdown';
import { UserContext } from '../lib/UserContext';
import withAuthentication from '../HOCs/withAuthentication';

const Home = () => {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const { products } = useStore();

  return (
    <Layout>
      <div className="pt-4 h-full flex flex-col bg-light-blue-600">
        <div className="px-4">
          <div className="flex justify-between pt-4 py-2">
            <div className="flex">
              <p className="text-3xl pr-2">👋</p>
              <div className="truncate">
                <p className="font-medium text-gray-200 leading-3">G&apos;Day</p>
                <p className="text-3xl font-bold text-white sm:text-2xl truncate">
                  {user.nicknames?.length > 0
                    ? user.nicknames[Math.floor(Math.random() * user.nicknames.length)]
                    : user.email}
                </p>
              </div>
            </div>
            <Dropdown
              className="w-56"
              button={({ open }) => (
                <button
                  type="button"
                  className={classNames(
                    'max-w-xs ml-3.5 w-9 h-9 bg-white flex items-center text-sm rounded-full dark:ring-offset-true-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-600 dark:focus:ring-light-blue-700 transition',
                    {
                      'ring-2 ring-offset-2 ring-light-blue-600 dark:ring-light-blue-700': open,
                    }
                  )}
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="w-9 h-9 text-light-blue-600" />
                  {/* <img
                    className="h-9 w-9 rounded-full md:h-10 md:w-10"
                    src="/uploads/avatars/temp.jpg"
                    alt=""
                  /> */}
                </button>
              )}
            >
              <div className="px-3 py-2">
                <p className="text-sm leading-5 dark:text-true-gray-100 transition-colors">
                  Signed in as
                </p>
                <p className="text-sm font-medium leading-5 text-gray-900 dark:text-true-gray-100 truncate transition-colors">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <DropdownButton>Your profile</DropdownButton>
                <DropdownButton>Settings</DropdownButton>
                <DropdownButton
                  onClick={async () => {
                    logout();
                    router.push('/login');
                  }}
                >
                  Logout
                </DropdownButton>
              </div>
            </Dropdown>
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

        <div className="space-y-4 flex-1 p-4 pb-16 bg-gray-100 rounded-t-3xl">
          <div className="bg-white shadow h-full rounded-t-3xl p-4">
            {/* <Transition
              show={!Array.isArray(products)}
              appear
              enter="transition ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="divide-y divide-gray-100"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={classNames('py-2 flex items-center justify-center', {
                    'pt-0': index === 0,
                    'pb-0': index === 5,
                  })}
                >
                  <div className="h-24 w-24 animate-pulse bg-gray-100" />
                  <div className="pl-2 space-y-1 h-26 flex-1">
                    <div className="w-10/12 bg-gray-300 animate-pulse h-4" />
                    <div className="w-2/5 bg-gray-100 animate-pulse h-3" />
                    <div className="w-1/4 bg-gray-300 animate-pulse h-4" />
                  </div>
                </div>
              ))}
            </Transition> */}

            <Transition
              show={products?.length > 0}
              appear
              enter="transition ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {products?.map((product, index) => (
                <div
                  className={classNames('py-2 flex items-center justify-center', {
                    'pt-0': index === 0,
                    'pb-0': index === products.length,
                  })}
                  key={product.id}
                >
                  <div className="flex items-center justify-center overflow-hidden w-24 h-24">
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full" />
                  </div>

                  <div className="pl-2 flex-1 flex flex-col">
                    <div className="flex-1 ">
                      <p className="text-gray-900 font-semibold line-clamp-2">{product.name}</p>
                      <p className="text-xs font-medium text-true-gray-400">{product.cupstring}</p>
                    </div>
                    <p className="text-light-blue-600 font-medium">
                      $
                      {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                        .format(product.price)
                        .substring(1)}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProduct(product.stockcode);
                        Toast({
                          title: `Removed "${product.name}" from the list.`,
                          undo: () => addProduct(product),
                        });
                      }}
                      className="text-red-600 border border-red-600 rounded-md p-1 hover:bg-red-600 hover:text-red-50 focus:bg-red-600 focus:text-red-50 focus:outline-none transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </Transition>

            {products?.length === 0 && (
              <div className="flex flex-col items-center">
                <img src="/celebration.png" alt="Celebration art" className="pb-4" />
                <h2 className="text-gray-900 text-2xl">The list is empty!</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuthentication(Home);
