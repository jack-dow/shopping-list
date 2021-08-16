import { useEffect, useContext, Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { UserContext } from '../lib/UserContext';

const withAuthentication = (WrappedComponent) => {
  const RequiresAuthentication = (props) => {
    const router = useRouter();
    const { user, getUser } = useContext(UserContext);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      if (!user) {
        getUser();
      }
    }, []);

    useEffect(() => {
      if (user) {
        setIsAuthenticated(true);
      }
    }, [user]);

    if (isAuthenticated == null) return <Fragment />;
    if (isAuthenticated === false) return <div>Not allowed.</div>;
    if (isAuthenticated) return <WrappedComponent {...props} />;

    return <div>An error has occured.</div>;
  };

  return RequiresAuthentication;
};

withAuthentication.propTypes = {
  WrappedComponent: PropTypes.node.isRequired,
};

export default withAuthentication;
