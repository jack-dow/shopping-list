import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { Transition } from '@headlessui/react';

import Layout from '../../components/Layout';
import { useItems } from '../../lib/queries/useItems';
import { UserContext } from '../../lib/UserContext';
import withAuthentication from '../../HOCs/withAuthentication';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/search/[term]/SkeletonLoader';
import { defaultOpacityTransition } from '../../styles/defaults';
import PageNavigation from '../../components/search/[term]/PageNavigation';
import Product from '../../components/search/[term]/Product';
import { useFavourites } from '../../lib/queries/useFavourites';
import { fetchProductsFromSearch } from '../../lib/queries/useProducts';
import EmptyState from '../../components/EmptyState';

function SearchTerm() {
  const router = useRouter();
  const { initialTerm } = router.query;
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState();
  const [term, setTerm] = useState(initialTerm || '');

  const [currentPage, setCurrentPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);

  const { items } = useItems();
  const { favourites } = useFavourites();

  // Fetch product data from woolworths API
  useEffect(() => {
    if (initialTerm && !products) {
      fetchProductsFromSearch(initialTerm, setProducts, setNumOfPages);
    }
  }, [initialTerm]);

  // Reset variables on term change
  useEffect(() => {
    setProducts();
    setCurrentPage(1);
    setTerm(router.query.term);
    fetchProductsFromSearch(router.query.term, setProducts, setNumOfPages);
  }, [router.query.term]);

  return (
    <Layout>
      <div className="px-4 pt-8">
        <Header
          icon="🔍"
          titleSmall={term ? 'Results for' : 'Find exactly'}
          title={term ? `"${term}"` : 'What you need'}
          productSearch
        />

        <SkeletonLoader show={!Array.isArray(products)} />

        <Transition
          show={products?.length > 0}
          {...defaultOpacityTransition}
          className="grid grid-cols-2 gap-3"
        >
          {products?.map((product) => (
            <Product
              key={product.stockcode}
              product={product}
              items={items}
              favourites={favourites}
              listID={user.list}
            />
          ))}
        </Transition>
      </div>
      {products && (
        <PageNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numOfPages={numOfPages}
          setProducts={setProducts}
        />
      )}
      {/* ********* No products found ********* */}
      <EmptyState
        show={products?.length === 0}
        image={<img src="/empty.svg" alt="Drawing of man holding an empty box" className="h-52" />}
        title={`Whoops. No product "${term}" could be found`}
        description="Check your spelling or enter a new term into the search bar"
      />
    </Layout>
  );
}

export default withAuthentication(SearchTerm);
