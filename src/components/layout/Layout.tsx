import {
  ClipboardListIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { Navbar } from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="px-4 pt-6">{children}</div>
      <Navbar>
        <Navbar.Button href="/">
          <HomeIcon />
        </Navbar.Button>

        <Navbar.Button href="/search">
          <SearchIcon />
        </Navbar.Button>

        <Navbar.Button href="/history">
          <ClipboardListIcon />
        </Navbar.Button>

        <Navbar.Button href="/favourites">
          <HeartIcon />
        </Navbar.Button>
      </Navbar>
    </>
  );
};
