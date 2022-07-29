import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon: string;
  withSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  withSearch,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <p className="pr-2 text-3xl">{icon}</p>
        <div className="truncate">
          <p className="font-medium leading-4 text-gray-600">{subtitle}</p>
          <p className="truncate text-3xl font-bold text-gray-800 sm:text-2xl">
            {title}
          </p>
        </div>
      </div>
      {withSearch && <ProductSearch />}
    </div>
  );
};

interface ProductSearchProps {}

const ProductSearch: React.FC<ProductSearchProps> = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  return (
    <form
      className="flex w-full pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search/${searchValue}`);
      }}
    >
      <label htmlFor="search_field" className="sr-only">
        Search
      </label>
      <div className="flex w-full  space-x-2">
        <div className="text-true-gray-500 focus-within:text-true-gray-300 relative flex-1 rounded-md shadow-sm transition">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
            <SearchIcon className="h-7 w-7" />
          </div>
          <input
            type="text"
            className="w-full rounded-lg border-none bg-white py-4 pl-10 text-gray-600 shadow-sm transition duration-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
            placeholder="Find a product"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};
