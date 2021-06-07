import toast from 'react-hot-toast';
import classNames from 'classnames';

import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Toast(config) {
  const { text, title, icon } = config;
  let { duration } = config;

  if (!duration) {
    duration = 2000;
  }

  return toast.custom(
    (t) => (
      <Fragment>
        <Transition
          show={t.visible}
          as={Fragment}
          enter="animate-enter ease-out duration-300 transition"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="animate-leave ease-in duration-100 transition"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="max-w-sm w-full bg-white dark:bg-true-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {icon || (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1">
                  {title && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors">
                      {title}
                    </p>
                  )}
                  {text && (
                    <p
                      className={classNames(
                        'text-sm text-gray-500 dark:text-true-gray-300 transition-colors',
                        {
                          'mt-1': title,
                        }
                      )}
                    >
                      {text}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    type="button"
                    className=" rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-true-gray-800 focus:ring-light-blue-600 dark:focus:ring-light-blue-700 transition"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Fragment>
    ),
    {
      duration,
    }
  );
}