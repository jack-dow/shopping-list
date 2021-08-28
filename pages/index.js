import { Transition } from '@headlessui/react';
import { NextSeo } from 'next-seo';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import SkeletonLoader from '../components/home/SkeletonLoader';
import Item from '../components/home/Item';
import { defaultOpacityTransition } from '../styles/defaults';
import EmptyState from '../components/EmptyState';
import { fetchAllItems } from '../redux/slices/itemsSlice';
import { fetchAllUsers } from '../redux/slices/userSlice';
import { sortProductsByName } from '../redux/store';

function Home() {
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.items);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllItems(true));
    dispatch(fetchAllUsers());
  }, []);

  useEffect(() => {
    if (items?.length > 0) {
      let newTotal = 0;
      const updatedCategories = [...categories];
      items.forEach((item) => {
        const itemCategory = item?.additionalAttributes?.sapdepartmentname;
        if (itemCategory) {
          if (item.price) newTotal += item.price * item.quantity;
          if (!updatedCategories.find((category) => category === itemCategory)) {
            updatedCategories.push(itemCategory);
          }
        }
      });
      if (newTotal > 0) setTotal(newTotal);
      if (updatedCategories.length > 0) setCategories(updatedCategories);
    }
  }, [items]);

  // console.log(items);

  const names = [user.name, ...user.nicknames];

  return (
    <Layout>
      <NextSeo
        title="Shopping List | TKIT"
        description="The TKIT shopping list is the best way to family your families shopping list."
      />
      <div className="px-4 py-8">
        {/* ********* Header ********* */}
        <Header
          icon="👋"
          titleSmall="G'day"
          title={names[Math.floor(Math.random() * names.length)]}
          productSearch
          showScanner
        />

        {/* ********* Skeleton Loader ********* */}
        <SkeletonLoader show={items === null} />

        {/* ********* items ********* */}
        <Transition
          show={items?.length > 0 && categories?.length > 0}
          appear
          {...defaultOpacityTransition}
          className="space-y-3"
        >
          <Fragment>
            {categories.sort().map((category) => {
              const sortedItems = sortProductsByName(
                items?.filter(
                  ({ additionalAttributes }) => additionalAttributes?.sapdepartmentname === category
                )
              );
              if (sortedItems.length === 0) {
                setCategories(categories.filter((name) => name !== category));
              }
              return (
                <div key={category}>
                  <div className="mb-3 tracking-tight text-gray-900 text-lg font-bold w-full">
                    {category && category.charAt(0).toUpperCase() + category.toLowerCase().slice(1)}
                  </div>

                  <div className="space-y-3">
                    {sortedItems.map((product) => (
                      <Item key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-200">
              <div className="flex justify-between pt-3">
                <div className="text-base font-medium text-gray-900">List total</div>
                <div className="text-base font-medium text-gray-900">${total.toFixed(2)}</div>
              </div>
            </div>
          </Fragment>
        </Transition>

        {/* ********* Empty list display ********* */}
        <EmptyState
          show={items?.length === 0}
          img={<img src="/celebration.svg" alt="Drawing of two beers clinking" className="h-72" />}
          title="The list is empty 🥳"
        />
      </div>
    </Layout>
  );
}

export default withAuthentication(Home);
