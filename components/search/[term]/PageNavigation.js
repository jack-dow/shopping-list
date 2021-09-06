import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { fetchProductsFromSearch } from '../../../redux/services/woolworths';

export default function PageNavigation({ currentPage, setCurrentPage, productCount, setProducts }) {
  const router = useRouter();

  return (
    <nav className="border-t border-gray-200 mt-4 pb-2 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={async () => {
            setProducts();
            await fetchProductsFromSearch(router.query.term, setProducts, null, currentPage - 1);
            setCurrentPage(currentPage - 1);
          }}
          className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 focus:outline-none transition disabled:opacity-50 disabled:text-gray-500 disabled:border-transparent"
        >
          <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>
      <div className="pt-4">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{Math.ceil(productCount / 12)}</span>{' '}
        </p>
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <button
          type="button"
          disabled={currentPage === Math.ceil(productCount / 12)}
          onClick={async () => {
            setProducts();
            await fetchProductsFromSearch(router.query.term, setProducts, null, currentPage + 1);
            setCurrentPage(currentPage + 1);
          }}
          className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 focus:outline-none transition disabled:opacity-50 disabled:text-gray-500 disabled:border-transparent"
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
