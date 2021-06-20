import { Menu, Transition } from '@headlessui/react';
import React from 'react';
import classNames from 'classnames';

export default function Dropdown({ button, children, className }) {
  return (
    <Menu>
      {({ open }) => (
        <div
          className={classNames('relative group transition-colors', {
            'z-10': open,
          })}
        >
          <Menu.Button as={React.Fragment}>{button}</Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className={classNames(
                'origin-top-right right-0 absolute mt-2 whitespace-nowrap rounded-md shadow-lg py-1 bg-white dark:bg-true-gray-800 divide-y divide-gray-100 dark:divide-true-gray-600 ring-1 ring-black ring-opacity-5 focus:outline-none transition-colors',
                {
                  [className]: className,
                }
              )}
            >
              {children}
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
}

export function DropdownButton({ children, onClick }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          onClick={onClick}
          className={classNames(
            'flex w-full justify-between text-sm px-4 py-2 leading-5 text-left focus:outline-none disabled:cursor-default disabled:opacity-80 disabled:bg-white disabled:text-gray-700 dark:disabled:bg-true-gray-800 dark:disabled:text-true-gray-400 transition',
            {
              'bg-gray-100 dark:bg-true-gray-700 text-gray-900 dark:text-true-gray-50': active,
              'text-gray-700 dark:text-true-gray-400': !active,
            }
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export function DropdownHyperlink({ children, href }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          className={classNames(
            'flex flex-1 justify-between px-4 py-2 leading-5 text-left focus:outline-none disabled:cursor-default disabled:opacity-80 disabled:bg-white disabled:text-gray-700 dark:disabled:bg-true-gray-800 dark:disabled:text-true-gray-400 transition',
            {
              'bg-gray-100 dark:bg-true-gray-700 text-gray-900 dark:text-true-gray-50': active,
              'text-gray-700 dark:text-true-gray-400': !active,
            }
          )}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  );
}
