import { useState, Fragment, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  BellIcon,
  ExclamationIcon,
  FireIcon,
  HeartIcon as HeartIconSolid,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/solid';
import { HeartIcon as HeartIconOutline, PlusCircleIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';

import { defaultOpacityTransition, fastOpacityTransition } from '../../../styles/defaults';
import DetailedProductModal from './DetailedProductModal';
import { addItem, editItemQuantity } from '../../../redux/slices/itemsSlice';
import { addFavourite, deleteFavourite } from '../../../redux/slices/favouritesSlice';

function checkIfSome(list, stockcodeToCheck) {
  return list?.some(({ stockcode }) => stockcode === stockcodeToCheck);
}

function findItem(list, stockcodeToFind) {
  return list?.find(({ stockcode }) => stockcode === stockcodeToFind);
}

export default function Product({ product, items, favourites }) {
  const dispatch = useDispatch();

  const [onShoppingList, setOnShoppingList] = useState(checkIfSome(items, product.stockcode));
  const [isFavourite, setIsFavourite] = useState(checkIfSome(favourites, product.stockcode));
  const [item, setItem] = useState(findItem(items, product.stockcode));

  const [isIncreasingQuantity, setIsIncreasingQuantity] = useState(false);
  const [isDecreasingQuantity, setIsDecreasingQuantity] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [isShowingDetailedProductModal, setIsShowingDetailedProductModal] = useState(false);

  const minusButtonRef = useRef(null);

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
    <Fragment>
      <DetailedProductModal
        open={isShowingDetailedProductModal}
        setOpen={setIsShowingDetailedProductModal}
        product={product}
      />
      <div className="relative flex flex-col bg-white shadow-md rounded-md border border-gray-100">
        {/* Favourites button */}
        <div className="absolute -top-3 -right-2 z-[2]">
          <button
            type="button"
            className="relative bg-white shadow w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
            onClick={async (e) => {
              e.stopPropagation();
              if (isFavourite) {
                dispatch(deleteFavourite(product.stockcode));
                setIsFavourite(false);
              } else {
                dispatch(addFavourite({ stockcode: product.stockcode, name: product.name }));
                setIsFavourite(true);
              }
            }}
          >
            <Transition
              show={!isFavourite}
              {...defaultOpacityTransition}
              className="absolute inset-center"
            >
              <HeartIconOutline className="w-3.5 h-3.5 text-red-600" />
            </Transition>
            <Transition
              show={isFavourite}
              {...defaultOpacityTransition}
              className="absolute inset-center"
            >
              <HeartIconSolid className="w-3.5 h-3.5 text-red-600" />
            </Transition>
          </button>
        </div>
        <button
          type="button"
          className="rounded-t-md flex-1 flex flex-col justify-start text-left focus:outline-none focus:ring-2 focus:ring-sky-600 focus:z-1 transition"
          onClick={() => setIsShowingDetailedProductModal(true)}
        >
          <img
            src={product.mediumImageFile}
            alt={product.name}
            className="w-28 h-28 mx-auto my-3"
          />
          <div className="px-3 pb-2 flex-1">
            {product.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <BellIcon className="w-3.5 h-3.5 mr-0.5" /> New
              </span>
            )}
            <p className="font-semibold text-gray-400 text-sm">{product.brand || 'Woolworths'}</p>
            <p className="font-semibold text-gray-700 leading-tight line-clamp-2 text-sm tracking-tight">
              {product.brand ? product.name.replace(`${product.brand} `, '') : product.name}
            </p>
            {product.cupString && (
              <p className="font-medium text-gray-400 text-xs lowercase py-0.5">
                {product.cupString}
              </p>
            )}
            {product.price && (
              <div>
                <p className="text-sm font-medium text-sky-600">${product.price.toFixed(2)}</p>
                {product.price < product.wasPrice && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 my-0.5">
                    <FireIcon className="w-3.5 h-3.5 mr-0.5" /> Save $
                    {product.savingsAmount.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            {!product.isAvailable && (
              <div className="my-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <ExclamationIcon className="w-3.5 h-3.5 mr-0.5" /> Unavailable
                </span>
              </div>
            )}
          </div>
        </button>
        <div
          className={classNames(
            'relative border-t border-gray-100 rounded-b-md h-[41px] -mb-px -mx-px transition',
            {
              'bg-white': !onShoppingList,
              'bg-sky-600': onShoppingList,
            }
          )}
        >
          <button
            type="button"
            tabIndex={!onShoppingList ? 0 : -1}
            className="flex items-center justify-center w-full h-full rounded-b-md focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
            onClick={(e) => {
              setIsAddingItem(true);
              dispatch(addItem({ item: { stockcode: product.stockcode, name: product.name } }));
              e.target.blur();
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mr-0.5 text-sky-600" />
            <p className="text-sky-600 font-medium text-sm">Add to List</p>
          </button>

          <Transition
            show={onShoppingList}
            {...fastOpacityTransition}
            className="absolute bottom-0 h-full text-white rounded-b-2xl w-full flex items-center justify-between px-3 space-x-2"
          >
            <button
              type="button"
              ref={minusButtonRef}
              disabled={isDecreasingQuantity}
              onClick={async (e) => {
                e.stopPropagation();
                if (item?.id && item?.quantity) {
                  setIsDecreasingQuantity(true);
                  await dispatch(editItemQuantity({ id: item?.id, quantity: item?.quantity - 1 }));
                  if (item?.quantity - 1 > 0) {
                    setIsDecreasingQuantity(false);
                    e.target.focus();
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
              onClick={async (e) => {
                e.stopPropagation();
                setIsIncreasingQuantity(true);
                await dispatch(editItemQuantity({ id: item?.id, quantity: item?.quantity + 1 }));
                setIsIncreasingQuantity(false);
                e.target.focus();
              }}
              className="w-6 h-6 flex items-center justify-center relative focus:outline-none focus:text-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </Transition>
        </div>
      </div>
    </Fragment>
  );
}
