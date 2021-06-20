import { SearchIcon } from '@iconicicons/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../components/Layout';

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  return (
    <Layout>
      <div className="pt-4 h-full flex flex-col bg-light-blue-600">
        <div className="px-4">
          <div className="flex pt-4 py-2">
            <p className="text-3xl pr-2">🔍</p>
            <div>
              <p className="font-medium text-gray-200 leading-3">Find exactly</p>
              <p className="text-3xl font-bold text-white sm:text-2xl">What you need</p>
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
          <div className="bg-white shadow h-full rounded-t-3xl p-4 divide-y divide-gray-100"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
