import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { defaultOpacityTransition } from '../../styles/defaults';

export default function SkeletonLoader({ show }) {
  return (
    <Transition appear show={show} {...defaultOpacityTransition} className="space-y-3 pb-3">
      {[...Array(4)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="space-y-3">
          {/* Category */}
          <div className="w-1/2 bg-gray-200 animate-pulse h-5 mb-1.5" />
          {[...Array(Math.floor(Math.random() * 4) + 1)].map((__, itemIndex) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={itemIndex}
              className={classNames(
                'p-3 relative rounded-2xl bg-white shadow flex items-center justify-center'
              )}
            >
              {/* Trash Icon */}
              <div className="bg-white w-6 h-6 absolute -top-2 -right-2 animate-pulse shadow rounded-full" />
              {/* Image */}
              <div className="animate-pulse bg-gray-100 mx-auto w-24 h-24" />
              {/* Main Info */}
              <div className="flex flex-col flex-1 pl-3">
                {/* Brand */}
                <div className="w-1/2 bg-gray-200 animate-pulse h-3 mb-1.5" />
                {/* Title */}
                <div className="w-10/12 bg-gray-300 animate-pulse h-3 mb-1" />
                <div className="w-7/12 bg-gray-300 animate-pulse h-3 mb-1.5" />
                {/* Cupstring */}
                <div className="w-1/3 bg-gray-100 animate-pulse h-3 mb-2" />
                {/* Price & Quantity Seletor */}
                <div className="flex justify-between items-center flex-1">
                  {/* Price */}
                  <div className="w-1/4 bg-gray-300 animate-pulse h-4" />
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between p-1.5 bg-gray-100 shadow-inner rounded-lg animate-pulse">
                    <div className="w-5 h-5 bg-white shadow rounded-md animate-pulse" />
                    <div className="mx-3.5 w-2" />
                    <div className="w-5 h-5 bg-white shadow rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </Transition>
  );
}
