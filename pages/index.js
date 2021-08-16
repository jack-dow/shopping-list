import { useContext } from 'react';
import { Transition } from '@headlessui/react';
import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import { UserContext } from '../lib/UserContext';
import { useItems } from '../lib/queries/useItems';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import SkeletonLoader from '../components/home/SkeletonLoader';
import Item from '../components/home/Item';
import { defaultOpacityTransition } from '../styles/defaults';
import EmptyState from '../components/EmptyState';

function Home() {
  const { user } = useContext(UserContext);
  const { items } = useItems(true);

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
        />

        {/* ********* Skeleton Loader ********* */}
        <SkeletonLoader show={items == null} />

        {/* ********* items ********* */}
        <Transition
          show={items?.length > 0}
          appear
          {...defaultOpacityTransition}
          className="space-y-3"
        >
          {items?.map((product) => (
            <Item key={product.id} product={product} listID={user.list} />
          ))}
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
