import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import sanitizeHtml from 'sanitize-html';
import { ChevronLeftIcon } from '@heroicons/react/outline';

import Layout from '../../components/Layout';
import { fetchDetailedProduct } from '../../lib/queries/useProducts';
import { supabase, useQuery } from '../../lib/Store';
import { addItem, editItemQuantity } from '../../lib/queries/useItems';
import { UserContext } from '../../lib/UserContext';
import withAuthentication from '../../HOCs/withAuthentication';

async function fetchItem(setState, itemStockcode) {
  const [item] = await useQuery(
    supabase.from('list_items').select('*').eq('stockcode', itemStockcode)
  );
  if (setState) setState(item);
  return item;
}

function DetailedProduct() {
  const router = useRouter();
  const { stockcode } = router.query;
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [listItem, setListItem] = useState(null);
  const [isIncreasingQuantity, setIsIncreasingQuantity] = useState(false);
  const [isDecreasingQuantity, setIsDecreasingQuantity] = useState(false);

  const [sanitizedDescription, setSanitizedDescription] = useState();

  useEffect(() => {
    if (stockcode && !product) fetchDetailedProduct(stockcode, setProduct);
    if (stockcode && listItem === null) fetchItem(setListItem, stockcode);
  }, [stockcode]);

  useEffect(() => {
    if (product?.richDescription) setSanitizedDescription(sanitizeHtml(product.richDescription));
  }, [product]);

  return (
    <Layout>
      {product ? (
        <Fragment>
          <div className="bg-white py-4 flex items-center justify-center relative">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute top-4 left-4 transition hover:text-gray-500 focus:text-gray-500 focus:outline-none"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <img src={product.largeImageFile} alt={product.name} className="w-[319px] h-[319px]" />
          </div>
          <div className="bg-blue-gray-100 rounded-2xl p-3 z-1 space-y-3">
            <div className="bg-white p-4 rounded-2xl space-y-1">
              <div className="w-4/5 mx-auto">
                <h1 className="text-lg font-semibold text-gray-900 text-center leading-6">
                  {product.name}
                </h1>
                <p className="text-center text-sm text-gray-300 font-medium mt-0.5">
                  {product.cupString}
                </p>
              </div>
              <div className="flex items-center justify-center mx-auto divide-x divide-gray-200 pb-1">
                <p className="font-semibold text-lg text-sky-600">
                  $
                  {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                    .format(product.price)
                    .substring(1)}
                </p>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-gray-100 shadow-inner rounded-lg w-28 mx-auto">
                <button
                  type="button"
                  disabled={isDecreasingQuantity || !listItem || listItem.quantity <= 0}
                  onClick={async () => {
                    setIsDecreasingQuantity(true);
                    const newItem = await editItemQuantity(listItem?.id, listItem?.quantity - 1);
                    if (newItem && !newItem.deleted) {
                      setListItem(newItem);
                    } else {
                      setListItem(undefined);
                    }
                    setIsDecreasingQuantity(false);
                  }}
                  className="relative flex items-center justify-center w-5 h-5 bg-white text-blue-gray-400 shadow rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon className="w-3 h-3 transition" />
                </button>
                <p className="flex items-center justify-center text-sm font-semibold text-gray-900">
                  {listItem?.quantity || 0}
                </p>
                <button
                  type="button"
                  disabled={isIncreasingQuantity || listItem?.quantity > 14}
                  onClick={async () => {
                    setIsIncreasingQuantity(true);
                    const newItem = await addItem(
                      { stockcode, name: product.displayName },
                      user.list
                    );
                    if (newItem) setListItem(newItem);
                    setIsIncreasingQuantity(false);
                  }}
                  className="relative flex items-center justify-center w-5 h-5 bg-white text-blue-gray-400 shadow rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="w-3 h-3 transition" />
                </button>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl space-y-2">
              <div className="flex items-center space-x-4">
                <p className="text-sm font-semibold">Description</p>
              </div>
              <div className="bg-sky-600 -mx-3 rounded-3xl">
                {sanitizedDescription ? (
                  <p
                    className="text-sm text-white p-3 leading-4"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                ) : (
                  <p className="text-sm text-white p-3 leading-4">No product descripiton.</p>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <div>
          <div className="bg-white flex items-center justify-center py-4">
            <div className="w-[319px] h-[319px] bg-gray-100 animate-pulse" />
          </div>
          <div className="bg-blue-gray-100 rounded-2xl p-3 space-y-3">
            <div className="w-full bg-white rounded-2xl p-4">
              <div className="w-3/4 mx-auto">
                <div className="h-5 bg-gray-200 animate-pulse mb-0.5" />
                <div className="h-5 w-3/4 mx-auto bg-gray-200 animate-pulse mb-1" />
                <div className="h-5 w-1/4 mx-auto bg-gray-100 animate-pulse mb-2" />
              </div>
              <div className="w-14 h-7 bg-gray-300 mx-auto animate-pulse mb-2" />
              <div className="flex w-28 mx-auto items-center justify-between p-1.5 bg-gray-100 shadow-inner rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-white shadow rounded-md animate-pulse" />
                <div className="px-1" />
                <div className="w-5 h-5 bg-white shadow rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default withAuthentication(DetailedProduct);
