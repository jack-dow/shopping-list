import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import classNames from '../../../../utils/classNames';
import { fetchProductsFromSearch } from '../../../../redux/services/woolworths';

const sortOptions = [
  { name: 'Most Popular', value: 'TraderRelevance' },
  { name: 'Specials', value: 'Specials' },
  { name: 'Newest', value: 'AvailableDateDesc' },
  { name: 'Name: A-Z', value: 'Name' },
  { name: 'Name: Z-A', value: 'NameDesc' },
  { name: 'Price: Low to High', value: 'PriceAsc' },
  { name: 'Price: High to Low', value: 'PriceDesc' },
  { name: 'Unit Price: Low to High', value: 'CUPAsc' },
  { name: 'Unit Price: High to Low', value: 'CUPDesc' },
];

export default function Sort({ setCurrentPage, setProducts, sortOrder, setSortOrder }) {
  const router = useRouter();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Sort
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-0.5 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => {
                      setSortOrder(option.value);
                      setCurrentPage(0);
                      setProducts(null);
                      fetchProductsFromSearch(
                        { searchTerm: router.query.term, sortOrder: option.value },
                        { setProducts }
                      );
                    }}
                    className={classNames(
                      sortOrder === option.value ? 'font-medium text-gray-900' : 'text-gray-500',
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
