import { SearchIcon } from '@iconicicons/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  return (
    <Layout>
      <NextSeo title="Product Search | TKIT Shopping List" />
      <div className="px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <p className="text-3xl pr-2">🔍</p>
            <div className="truncate">
              <p className="font-medium text-gray-600 leading-4">Find exactly</p>
              <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">What you need</p>
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
                  className="shadow-sm border-none py-4 pl-10 bg-white rounded-lg w-full text-gray-600 focus:ring-2 focus:ring-sky-600 transition"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="pt-3 flex flex-col items-center space-y-8">
          <div className="flex items-center justify-center mx-auto">
            <img src="/search.svg" alt="Drawing a detective searching a phone" className="h-72" />
          </div>
          <div className="relative">
            <p className="text-center text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What are you looking for today?
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-center text-gray-500">
              Start the search by entering the product name into the search bar
            </p>
          </div>
        </div>
        {/* <div className="w-2/3 mx-auto pt-16 flex flex-col items-center justify-center">
          <div className="p-5 bg-light-blue-100 text-light-blue-600 rounded-full mb-3">
            <SearchIcon className="w-14 h-14" />
          </div>
          <p className="text-2xl font-bold text-gray-800 pb-2">Let&apos;s get started</p>
          <p className="text-sm text-gray-600 text-center leading-4 px-4">
            Enter into the search bar the product you&apos;re looking for
          </p>
        </div> */}
      </div>
    </Layout>
  );
};

export default withAuthentication(Search);
