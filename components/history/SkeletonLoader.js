import { Transition } from '@headlessui/react';
import { defaultOpacityTransition } from '../../styles/defaults';

export default function SkeletonLoader({ show }) {
  return (
    <Transition appear show={show} {...defaultOpacityTransition} className="mt-3">
      {[...Array(3)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index + 15}>
          {/* Date */}
          <div className="w-3/12 h-4 bg-gray-300 animate-pulse mb-3" />
          {[...Array(4)].map((__, historyIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="relative pb-7" key={historyIndex}>
              {/* Connecting line */}
              {historyIndex !== 3 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              {/* Main Info */}
              <div className="relative flex space-x-3">
                {/* Icon */}
                <div className="h-8 w-8 bg-gray-300 rounded-full ring-8 ring-gray-100 flex items-center justify-center animate-pulse" />
                {/* Main Text */}
                <div className="flex flex-1 flex-col">
                  <div className="bg-gray-300 animate-pulse h-4 w-full mb-1.5" />
                  <div className="bg-gray-300 animate-pulse h-4 w-3/5" />
                </div>

                {/* Time */}
                <div className="bg-gray-300 animate-pulse h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </Transition>
  );
}
