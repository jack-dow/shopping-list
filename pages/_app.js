import { useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

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
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;
