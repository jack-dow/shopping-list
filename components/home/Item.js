import { ExclamationIcon, FireIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { TrashIcon } from '@heroicons/react/outline';
import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import Toast from '../Toast';
import DetailedProductModal from '../search/[term]/DetailedProductModal';
import { addItem, deleteItem, editItemQuantity } from '../../redux/slices/itemsSlice';

export default function Item({ product }) {
  const dispatch = useDispatch();
  const [isIncreasingQuantity, setIsIncreasingQuantity] = useState(false);
  const [isDecreasingQuantity, setIsDecreasingQuantity] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isShowingDetailedProductModal, setIsShowingDetailedProductModal] = useState(false);

  return (
    <Fragment>
      <DetailedProductModal
        open={isShowingDetailedProductModal}
        setOpen={setIsShowingDetailedProductModal}
        product={product}
      />
      <div
        className="rounded-md p-3.5 bg-white shadow-md flex items-center justify-center relative"
        key={product.stockcode}
      >
        <div className="absolute -top-2 -right-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={async (e) => {
              e.stopPropagation();
              setIsDeleting(true);
              await dispatch(deleteItem(product.id));

              Toast({
                title: `Removed "${product.name}" from the list.`,
                undo: () =>
                  dispatch(
                    addItem({
                      item: {
                        id: product.id,
                        quantity: product.quantity,
                        stockcode: product.stockcode,
                        name: product.name,
                      },
                      withData: true,
                    })
                  ),
              });
            }}
            className="relative flex items-center justify-center rounded-full shadow text-gray-600 bg-white w-6 h-6 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <img src={product.mediumImageFile} alt={product.name} className="w-24 h-24" />
        <div className="pl-3 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-400 text-sm">{product.brand || 'Woolworths'}</p>

              {!product.isAvailable && (
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <ExclamationIcon className="w-3.5 h-3.5 mr-0.5" /> Unavailable
                  </span>
                </div>
              )}
            </div>
            <p className="font-semibold text-gray-700 leading-tight line-clamp-2 text-sm tracking-tight">
              {product.brand ? product.name.replace(`${product.brand} `, '') : product.name}
            </p>
            {product.cupString && (
              <p className="font-medium text-gray-400 text-xs lowercase py-0.5">
                {product.cupString}
              </p>
            )}
          </div>
          {product.price < product.wasPrice && (
            <div className="-mb-0.5 pt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <FireIcon className="w-3.5 h-3.5 mr-0.5" /> Save ${product.savingsAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            {product.price && (
              <p className="text-sky-600 font-semibold">${product.price.toFixed(2)}</p>
            )}

            <div className="flex items-center space-x-3.5 p-1.5 bg-gray-100 shadow-inner rounded-lg">
              <button
                type="button"
                disabled={isDecreasingQuantity || isDeleting}
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsDecreasingQuantity(true);
                  await dispatch(
                    editItemQuantity({ id: product.id, quantity: product.quantity - 1 })
                  );
                  if (product.quantity - 1 > 0) {
                    setIsDecreasingQuantity(false);
                    e.target.focus();
                  } else {
                    Toast({
                      title: `Removed "${product.name}" from the list.`,
                      undo: () =>
                        dispatch(
                          addItem({
                            item: {
                              id: product.id,
                              quantity: product.quantity,
                              stockcode: product.stockcode,
                              name: product.name,
                            },
                            withData: true,
                          })
                        ),
                    });
                  }
                }}
                className="relative flex items-center justify-center w-5 h-5 bg-white text-blue-gray-400 shadow rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-3 h-3 transition" />
              </button>
              <p className="flex items-center justify-center text-sm font-semibold text-gray-900">
                {product.quantity}
              </p>
              <button
                type="button"
                disabled={isIncreasingQuantity || product.quantity > 14 || isDeleting}
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsIncreasingQuantity(true);
                  await dispatch(
                    editItemQuantity({ id: product.id, quantity: product.quantity + 1 })
                  );
                  setIsIncreasingQuantity(false);
                  e.target.focus();
                }}
                className="relative flex items-center justify-center w-5 h-5 bg-white text-blue-gray-400 shadow rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-3 h-3 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
