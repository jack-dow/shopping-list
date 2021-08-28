import { useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUser, setIsAuthenticated } from '../redux/slices/userSlice';
import { supabase } from '../lib/initSupabase';
import Spinner from '../components/Spinner';

const withAuthentication = (WrappedComponent) => {
  const RequiresAuthentication = (props) => {
    const router = useRouter();
    const { session, user, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      let currentSession = supabase.auth.session();
      if (!currentSession && session) {
        supabase.auth.setAuth(session.access_token);
        currentSession = session;
      }

      if (!user && currentSession) {
        dispatch(fetchUser(session?.user.id || currentSession?.user.id));
      } else if (!user && !currentSession) {
        dispatch(setIsAuthenticated(false));
      }
    }, [user, session]);

    useEffect(() => {
      if (isAuthenticated === false) {
        router.push('/login');
        dispatch(setIsAuthenticated(null));
      }
    }, [isAuthenticated]);

    if (!isAuthenticated)
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <svg
            className="animate-spin h-6 w-6 text-sky-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      );
    if (isAuthenticated) return <WrappedComponent {...props} />;

    return <div>An error has occured.</div>;
  };

  return RequiresAuthentication;
};

withAuthentication.propTypes = {
  WrappedComponent: PropTypes.node.isRequired,
};

export default withAuthentication;
