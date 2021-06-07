import { Toaster } from 'react-hot-toast';

import { UserProvider } from '../lib/UserContext';

import '../styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;
