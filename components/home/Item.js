import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { TrashIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useState } from 'react';

import { addItem, deleteItem, editItemQuantity } from '../../lib/queries/useItems';
import Toast from '../Toast';

export default function Item({ product, listID }) {
  const [isIncreasingQuantity, setIsIncreasingQuantity] = useState(false);
  const [isDecreasingQuantity, setIsDecreasingQuantity] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      className={classNames(
        'p-3.5 rounded-xl bg-white shadow-md flex items-center justify-center relative',
        {}
      )}
      key={product.stockcode}
    >
      <div className="absolute -top-1 -right-1">
        <button
          type="button"
          disabled={isDeleting}
          onClick={async () => {
            setIsDeleting(true);
            await deleteItem(product.id);
            Toast({
              title: `Removed "${product.name}" from the list.`,
              undo: () =>
                addItem(
                  {
                    id: product.id,
                    quantity: product.quantity,
                    stockcode: product.stockcode,
                    name: product.displayName,
                  },
                  listID
                ),
            });
          }}
          className="relative flex items-center justify-center rounded-full shadow text-gray-600 bg-white w-6 h-6 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center justify-center overflow-hidden w-24 h-24">
        <img
          src={product.mediumImageFile}
          alt={product.displayName}
          className="max-w-full max-h-full w-full h-full"
        />
      </div>
      <div className="pl-3 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-gray-900 font-semibold leading-5 line-clamp-2 pr-3">
            {product.displayName}
          </p>
          <p className="text-xs font-medium text-true-gray-400">{product.cupString}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sky-600 font-semibold text-">
              $
              {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                .format(product.price)
                .substring(1)}
            </p>
          </div>
          <div className="flex items-center space-x-3.5 p-1.5 bg-gray-100 shadow-inner rounded-lg">
            <button
              type="button"
              disabled={isDecreasingQuantity}
              onClick={async () => {
                setIsDecreasingQuantity(true);
                await editItemQuantity(product.id, product.quantity - 1);
                if (product.quantity - 1 > 0) {
                  setIsDecreasingQuantity(false);
                } else {
                  Toast({
                    title: `Removed "${product.displayName}" from the list.`,
                    undo: () =>
                      addItem(
                        {
                          id: product.id,
                          quantity: product.quantity,
                          stockcode: product.stockcode,
                          name: product.displayName,
                        },
                        listID
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
              disabled={isIncreasingQuantity || product.quantity > 14}
              onClick={async () => {
                setIsIncreasingQuantity(true);
                await editItemQuantity(product.id, product.quantity + 1);
                setIsIncreasingQuantity(false);
              }}
              className="relative flex items-center justify-center w-5 h-5 bg-white text-blue-gray-400 shadow rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition disabled:opacity-30 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-3 h-3 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
