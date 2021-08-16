/* eslint-disable no-nested-ternary */
import { Transition } from '@headlessui/react';
import { useContext, useEffect, useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';

import { useFavourites } from '../lib/queries/useFavourites';
import { supabase } from '../lib/Store';
import { UserContext } from '../lib/UserContext';
import { useItems } from '../lib/queries/useItems';
import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import { defaultOpacityTransition } from '../styles/defaults';
import Product from '../components/search/[term]/Product';
import SkeletonLoader from '../components/search/[term]/SkeletonLoader';

function Favourites() {
  const { user } = useContext(UserContext);
  const { items } = useItems();
  const [inputValue, setInputValue] = useState('');
  const [filterValue, setFilterValue] = useState(null);
  const { favourites } = useFavourites(true, filterValue);

  return (
    <Layout>
      <div className="px-4 py-8">
        {/* ********* Header ********* */}
        <Header icon="❤" titleSmall="The products" title="You Love">
          <form
            className="w-full flex pb-4"
            onSubmit={(e) => {
              e.preventDefault();

              setFilterValue(inputValue);
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
          </form>
        </Header>

        <SkeletonLoader show={!Array.isArray(favourites)} />

        {/* Main Content */}
        <Transition
          show={favourites?.length > 0}
          appear
          {...defaultOpacityTransition}
          className="grid grid-cols-2 gap-3"
        >
          {favourites?.map((favourite) => (
            <Product
              key={favourite.id}
              product={favourite}
              items={items}
              favourites={favourites}
              listID={user.list}
            />
          ))}
        </Transition>
      </div>
    </Layout>
  );
}

export default withAuthentication(Favourites);
