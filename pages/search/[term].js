import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import withAuthentication from '../../HOCs/withAuthentication';
import Header from '../../components/Header';
import SkeletonLoader from '../../components/search/[term]/SkeletonLoader';
import { defaultOpacityTransition } from '../../styles/defaults';
import PageNavigation from '../../components/search/[term]/PageNavigation';
import Product from '../../components/search/[term]/Product';
import EmptyState from '../../components/EmptyState';
import { fetchProductsFromSearch } from '../../redux/services/woolworths';
import { clearItems, fetchAllItems } from '../../redux/slices/itemsSlice';
import { clearFavourites, fetchAllFavourites } from '../../redux/slices/favouritesSlice';
import Filters from '../../components/search/[term]/Filters';

function SearchTerm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialTerm } = router.query;
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.items);
  const { favourites } = useSelector((state) => state.favourites);

  const [products, setProducts] = useState();
  const [term, setTerm] = useState(initialTerm || '');

  const [currentPage, setCurrentPage] = useState(1);
  const [productCount, setProductCount] = useState(1);

  console.log(favourites);

  useEffect(() => {
    dispatch(fetchAllItems());
    dispatch(fetchAllFavourites());

    return () => {
      dispatch(clearItems());
      dispatch(clearFavourites());
    };
  }, []);

  // Fetch product data from woolworths API
  useEffect(() => {
    if (initialTerm && !products) {
      fetchProductsFromSearch(initialTerm, setProducts, setProductCount);
    }
  }, [initialTerm]);

  // Reset variables on term change
  useEffect(() => {
    setProducts();
    setCurrentPage(1);
    setTerm(router.query.term);
    fetchProductsFromSearch(router.query.term, setProducts, setProductCount);
  }, [router.query.term]);

  return (
    <Layout>
      <div className="px-4 pt-8">
        <Header
          icon="🔍"
          titleSmall={term ? 'Results for' : 'Find exactly'}
          title={term ? `"${term}"` : 'What you need'}
          productSearch
          showScanner
        />
        <Filters productCount={productCount} />

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

        {/* ********* No products found ********* */}
        <EmptyState
          show={products?.length === 0}
          img={<img src="/empty.svg" alt="Drawing of man holding an empty box" className="h-52" />}
          title={`Whoops. No product "${term}" could be found`}
          description="Check your spelling or enter a new term into the search bar"
        />
      </div>

      {products?.length > 0 && (
        <PageNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productCount={productCount}
          setProducts={setProducts}
        />
      )}
    </Layout>
  );
}

export default withAuthentication(SearchTerm);
