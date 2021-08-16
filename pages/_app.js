import { useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { DefaultSeo } from 'next-seo';

import { UserProvider } from '../lib/UserContext';

import '../styles.css';

function MyApp({ Component, pageProps }) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 2) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  return (
    <UserProvider>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://www.shopping.tkit.tech/',
          site_name: 'TKIT Shopping List',
        }}
      />
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;
