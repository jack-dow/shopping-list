/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Link from 'next/link';

import { SearchIcon, HomeIcon, UserIcon, ClipboardIcon } from '@iconicicons/react';

export default function Layout({ title, children, contentMaxWidth }) {
  return (
    <div className="w-screen h-screen bg-gray-100  relative transition-colors">
      <div className="h-screen flex overflow-hidden bg-gray-100  transition-colors">
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Content */}
          <main
            className="flex flex-col flex-1 relative overflow-y-auto pb-16 focus:outline-none"
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
                    <div className="border-4 border-dashed border-gray-200  rounded-lg h-96" />
                  </div>
                )}
              </div>
            </div>
          </main>
          <nav className="fixed bottom-0 w-full z-20 flex-shrink-0 px-4 py-2 flex justify-between items-center bg-gray-100">
            <BottomNavButton href="/" title="Home">
              <HomeIcon className="w-8 h-8" />
            </BottomNavButton>
            <BottomNavButton href="/search" title="Search">
              <SearchIcon className="w-8 h-8" />
            </BottomNavButton>
            <BottomNavButton href="/history" title="History">
              <ClipboardIcon className="w-8 h-8" />
            </BottomNavButton>
            <BottomNavButton href="/settings" title="Profile">
              <UserIcon className="w-8 h-8" />
            </BottomNavButton>
          </nav>
        </div>
      </div>
    </div>
  );
}

const BottomNavButton = ({ children, href, title, disabled }) => {
  const router = useRouter();

  const isActive =
    (href === '/' && href === router.asPath) || (href !== '/' && router.asPath.startsWith(href));

  return (
    <Link href={href} shallow>
      <a
        href={href}
        className={classNames(
          'group flex relative items-center text-sm font-medium bg-transparent focus:outline-none transition-all transform',
          {
            'text-gray-400': !isActive,
            'opacity-50 pointer-events-none': disabled,
          }
        )}
      >
        <div
          className={classNames(
            'rounded-2xl transition flex flex-col items-center justify-center',
            {
              'text-sky-600 ': isActive,
            }
          )}
        >
          {children}
          <div>{title}</div>
        </div>
        {/* 
        <Transition
          show={isActive}
          appear
          enter="transition ease-in duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="text-sky-600"
        >
          {title}
        </Transition> */}
      </a>
    </Link>
  );
};
