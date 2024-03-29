import { SearchIcon } from '@iconicicons/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import BarcodeIcon from './icons/BarcodeIcon';

export default function Header({ title, titleSmall, icon, productSearch, showScanner, children }) {
  const [showingScannerModal, setShowingScannerModal] = useState(false);
  return (
    <Fragment>
      <BarcodeScanner
        open={showingScannerModal}
        setOpen={() => setShowingScannerModal(!showingScannerModal)}
      />
      <div className="space-y-4">
        <div
          className={classNames('flex items-center', {
            'pb-4': !productSearch && !children,
          })}
        >
          <p className="text-3xl pr-2">{icon}</p>
          <div className="truncate">
            <p className="font-medium text-gray-600 leading-4">{titleSmall}</p>
            <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">{title}</p>
          </div>
        </div>
        {productSearch && (
          <ProductSearchInput
            showScanner={showScanner}
            setShowingScannerModal={setShowingScannerModal}
          />
        )}
        {children}
      </div>
    </Fragment>
  );
}

export function ProductSearchInput({ showScanner, setShowingScannerModal }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  return (
    <form
      className="w-full flex pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search/${searchValue}`);
      }}
    >
      <label htmlFor="search_field" className="sr-only">
        Search
      </label>
      <div className="flex space-x-2  w-full">
        <div className="relative rounded-md shadow-sm flex-1 text-true-gray-500 focus-within:text-true-gray-300 transition">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <SearchIcon className="w-7 h-7" />
          </div>
          <input
            type="text"
            className="shadow-sm border-none py-4 pl-10 bg-white rounded-lg w-full text-gray-600 focus:ring-2 focus:ring-sky-600 transition"
            placeholder="Find a product"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {showScanner &&
          navigator.mediaDevices &&
          typeof navigator.mediaDevices.getUserMedia === 'function' && (
            <button
              type="button"
              onClick={() => setShowingScannerModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-sky-600 hover:bg-sky-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
            >
              <BarcodeIcon className="w-8 h-8" />
            </button>
          )}
      </div>
    </form>
  );
}
