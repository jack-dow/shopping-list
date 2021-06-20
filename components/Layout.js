/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Link from 'next/link';
import { SearchIcon, FileTextIcon, BookIcon } from '@iconicicons/react';

export default function Layout({ title, children, contentMaxWidth }) {
  const router = useRouter();
  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-true-gray-900 relative transition-colors">
      <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-true-gray-900 transition-colors">
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Content */}
          <main
            className="flex flex-col flex-1 relative overflow-y-auto focus:outline-none"
            tabIndex="0"
          >
            <div className="flex flex-col flex-1">
              {title && (
                <div className="mx-auto px-4 pb-4 w-full flex flex-col flex-1 relative md:px-8">
                  <div className="flex items-center justify-center flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 ">{title}</h2>
                  </div>
                </div>
              )}
              <div
                className={classNames('mx-auto w-full flex flex-col flex-1 relative md:px-8', {
                  'max-w-screen-2xl': !contentMaxWidth,
                  [contentMaxWidth]: contentMaxWidth,
                })}
              >
                {children || (
                  <div className="py-4">
                    <div className="border-4 border-dashed border-gray-200 dark:border-true-gray-400 rounded-lg h-96" />
                  </div>
                )}
              </div>
            </div>
          </main>
          <div className="fixed bottom-0 w-full z-20 flex-shrink-0 flex justify-evenly items-center h-16 bg-white shadow-bottom-nav transition-colors">
            <div>
              <BottomNavButton href="/search">
                <SearchIcon className="w-8 h-8" />
                Search
              </BottomNavButton>
            </div>
            <div className="pb-7">
              <Link href="/" shallow>
                <a
                  href="/"
                  className={classNames(
                    'flex border-8 rounded-full p-4 focus:outline-none focus:bg-white focus:text-light-blue-600 focus:border-light-blue-600 transition duration-300',
                    {
                      'bg-white text-light-blue-600 border-light-blue-600': router.asPath === '/',
                      'bg-light-blue-600 text-white border-transparent': router.asPath !== '/',
                    }
                  )}
                >
                  <FileTextIcon className="w-8 h-8" />
                </a>
              </Link>
            </div>
            <div>
              <BottomNavButton href="/recipes" disabled>
                <BookIcon className="w-8 h-8" />
                Recipes
              </BottomNavButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomNavButton = ({ children, href, as, disabled }) => {
  const router = useRouter();

  const isActive =
    (href === '/' && href === router.asPath) || (href !== '/' && router.asPath.startsWith(href));

  return (
    <Link href={href} as={as} shallow>
      <a
        href={href}
        disabled={disabled}
        className={classNames(
          'flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-transparent text-gray-700 focus:outline-none focus:bg-light-blue-100 focus:text-light-blue-800 transition',
          {
            'bg-light-blue-100 text-light-blue-800': isActive,
            'text-gray-700': !isActive,
            'opacity-50 pointer-events-none': disabled,
          }
        )}
      >
        {children}
      </a>
    </Link>
  );
};
