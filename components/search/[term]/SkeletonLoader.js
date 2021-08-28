import { Transition } from '@headlessui/react';

import { defaultOpacityTransition } from '../../../styles/defaults';

export default function SkeletonLoader({ show }) {
  return (
    <Transition
      appear
      show={show}
      {...defaultOpacityTransition}
      className="grid grid-cols-2 gap-3 pb-3"
    >
      {[...Array(6)].map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="flex relative flex-col space-y-3 bg-white rounded-2xl p-3 pb-0 shadow"
        >
          <div className="bg-white w-6 h-6 absolute -top-2 -right-2 animate-pulse shadow rounded-full" />
          <div className="animate-pulse bg-gray-100 mx-auto w-28 h-28" />

          <div className="space-y-1">
            <div className="w-1/2 bg-gray-200 animate-pulse h-3 mb-1.5" />
            <div className="w-10/12 bg-gray-300 animate-pulse h-3" />
            <div className="w-1/2 bg-gray-100 animate-pulse h-3" />
          </div>
          <div className="w-1/3 bg-gray-300 animate-pulse h-4" />
          <div className="h-11 border-t border-gray-100 flex items-center justify-center -mx-3">
            <div className="w-24 bg-gray-300 animate-pulse h-4" />
          </div>
        </div>
      ))}
    </Transition>
  );
}
