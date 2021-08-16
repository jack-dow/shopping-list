import { useState, Fragment, useEffect } from 'react';
import classNames from 'classnames';
import { HeartIcon as HeartIconSolid, MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { HeartIcon as HeartIconOutline, PlusCircleIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';

import { addItem, editItemQuantity } from '../../../lib/queries/useItems';
import { addFavourite, deleteFavourite } from '../../../lib/queries/useFavourites';
import { fastOpacityTransition } from '../../../styles/defaults';

function checkIfSome(list, stockcodeToCheck) {
  return list?.some(({ stockcode }) => stockcode === stockcodeToCheck);
}

function findItem(list, stockcodeToFind) {
  return list?.find(({ stockcode }) => stockcode === stockcodeToFind);
}

export default function Product({ product, items, favourites, listID }) {
  const [onShoppingList, setOnShoppingList] = useState(checkIfSome(items, product.stockcode));
  const [isFavourite, setIsFavourite] = useState(checkIfSome(favourites, product.stockcode));
  const [item, setItem] = useState(findItem(items, product.stockcode));

  const [isIncreasingQuantity, setIsIncreasingQuantity] = useState(false);
  const [isDecreasingQuantity, setIsDecreasingQuantity] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    setOnShoppingList(checkIfSome(items, product.stockcode));
    setItem(findItem(items, product.stockcode));
  }, [items]);

  useEffect(() => {
    setIsFavourite(checkIfSome(favourites, product.stockcode));
  }, [favourites]);

  useEffect(() => {
    if (!onShoppingList) {
      if (isIncreasingQuantity) setIsIncreasingQuantity(false);
      if (isDecreasingQuantity) setIsDecreasingQuantity(false);
    }
    if (onShoppingList && isAddingItem) setIsAddingItem(false);
  }, [onShoppingList]);

  return (
    <div
      key={product.stockcode}
      className={classNames('flex relative flex-col bg-white rounded-2xl p-3 pb-0 shadow', {
        'pointer-events-none': !product.isAvailable,
      })}
    >
      {!product.isAvailable && (
        <Fragment>
          <div className="absolute z-20 flex items-center justify-center inset-0">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-md font-medium bg-pink-100 text-pink-800">
              Unavailable
            </span>{' '}
          </div>
          <div className="absolute bg-white opacity-50 inset-0 z-10" />
        </Fragment>
      )}
      <div className="flex items-center justify-center mb-2">
        <img src={product.mediumImageFile} alt={product.displayName} className="w-30 h-30" />
      </div>
      <div className="absolute top-0 right-2">
        <button
          type="button"
          className="relative w-6 h-6"
          onClick={() => {
            if (isFavourite) {
              deleteFavourite(product.stockcode, listID);
              setIsFavourite(false);
            } else {
              addFavourite(product.stockcode, product.displayName, listID);
              setIsFavourite(true);
            }
          }}
        >
          <HeartIconOutline
            className={classNames('absolute inset-y-0 w-6 h-6 text-red-600 transition-all', {
              'opacity-100': !isFavourite,
              'opacity-0': isFavourite,
            })}
          />
          <HeartIconSolid
            className={classNames('absolute inset-y-0 w-6 h-6 text-red-600 transition-all', {
              'opacity-100': isFavourite,
              'opacity-0': !isFavourite,
            })}
          />
        </button>
      </div>
      <div className="flex flex-col">
        <div className="">
          <p className="text-gray-900 font-medium leading-6 line-clamp-2">{product.displayName}</p>
          <p className="text-xs text-true-gray-400 opacity-80">
            {product.cupString?.toLowerCase() || 'N/A'}
          </p>
        </div>
        <p className="text-sky-600 font-medium leading-8">
          $
          {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
            .format(product.price)
            .substring(1)}
        </p>
      </div>
      <div
        className={classNames(
          'border-t border-gray-200 h-11 -mx-3 relative rounded-b-2xl transition duration-150',
          {
            'bg-white': !onShoppingList,
            'bg-sky-600': onShoppingList,
          }
        )}
      >
        <button
          type="button"
          disabled={isAddingItem}
          className="flex space-x-1 relative items-center justify-center w-full py-3 h-11 rounded-b-2xl transition focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
          tabIndex={onShoppingList ? -1 : 0}
          onClick={async () => {
            setIsAddingItem(true);
            await addItem({ stockcode: product.stockcode, name: product.displayName }, listID);
          }}
        >
          <PlusCircleIcon className="w-5 h-5 text-sky-600" />
          <p className="text-sky-600 font-medium text-sm">Add to List</p>
        </button>
        <Transition
          show={onShoppingList}
          {...fastOpacityTransition}
          className="absolute bottom-0 h-full text-white rounded-b-2xl w-full flex items-center justify-between px-3 space-x-2"
        >
          <button
            type="button"
            disabled={isDecreasingQuantity}
            onClick={async () => {
              if (item?.id && item?.quantity) {
                setIsDecreasingQuantity(true);
                await editItemQuantity(item?.id, item?.quantity - 1);
                if (item?.quantity - 1 > 0) {
                  setIsDecreasingQuantity(false);
                }
              }
            }}
            className="w-6 h-6 flex items-center justify-center relative focus:outline-none focus:text-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MinusIcon className="w-5 h-5" />
          </button>
          <p>{item?.quantity}</p>
          <button
            type="button"
            disabled={isIncreasingQuantity || item?.quantity > 14}
            onClick={async () => {
              setIsIncreasingQuantity(true);
              await editItemQuantity(item?.id, item?.quantity + 1);
              setIsIncreasingQuantity(false);
            }}
            className="w-6 h-6 flex items-center justify-center relative focus:outline-none focus:text-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </Transition>
      </div>
    </div>
  );
}
