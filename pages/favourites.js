/* eslint-disable no-nested-ternary */
import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '@iconicicons/react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import { defaultOpacityTransition } from '../styles/defaults';
import Product from '../components/search/[term]/Product';
import SkeletonLoader from '../components/search/[term]/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { fetchAllItems } from '../redux/slices/itemsSlice';
import { fetchAllFavourites } from '../redux/slices/favouritesSlice';
import { sortProductsByName } from '../redux/store';

function Favourites() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.items);
  const { favourites } = useSelector((state) => state.favourites);
  const [sortedFavourites, setSortedFavourites] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [filterValue, setFilterValue] = useState(null);

  useEffect(() => {
    dispatch(fetchAllItems(true));
  }, []);

  useEffect(() => {
    if (favourites?.length > 0) setSortedFavourites(sortProductsByName(favourites));
  }, [favourites]);

  useEffect(() => {
    dispatch(fetchAllFavourites({ withData: true, filterValue }));
  }, [filterValue]);

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
                  placeholder="Filter favourites"
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
          show={sortedFavourites?.length > 0}
          appear
          {...defaultOpacityTransition}
          className="grid grid-cols-2 gap-3"
        >
          {sortedFavourites?.map((favourite) => (
            <Product
              key={favourite.id}
              product={favourite}
              items={items}
              favourites={favourites}
              listID={user.list}
            />
          ))}
        </Transition>

        <EmptyState
          show={favourites?.length === 0}
          img={
            <img
              src="/spread_love.svg"
              alt="Drawing a woman sitting infront of a heart"
              className="h-48"
            />
          }
          title="No favourites added yet"
          description="Heart your favourite products in the search and then they'll appear here for easy access"
        />
      </div>
    </Layout>
  );
}

export default withAuthentication(Favourites);
