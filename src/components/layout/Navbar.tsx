import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import clsx from 'clsx';

interface NavbarRootProps {
  children: React.ReactNode;
}

const NavbarRoot: React.FC<NavbarRootProps> = ({ children }) => {
  return (
    <div className="fixed bottom-0 flex w-full justify-between border-t border-gray-200 p-4 px-6">
      <>{children}</>
    </div>
  );
};

interface NavbarButtonProps {
  children: React.ReactNode;
  href: string;
}

const Button: React.FC<NavbarButtonProps> = ({ href, children }) => {
  const router = useRouter();
  return (
    <Link href="">
      <a
        className={clsx(
          'flex h-8 w-8 flex-col items-center justify-center',
          router.asPath === href ? 'text-sky-600' : 'text-gray-400',
        )}
      >
        {children}
      </a>
    </Link>
  );
};

export const Navbar = Object.assign(NavbarRoot, { Button });
