import { useEffect, useContext, Fragment } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { UserContext } from '../lib/UserContext';

const withAuthentication = (WrappedComponent) => {
  const RequiresAuthentication = (props) => {
    const router = useRouter();
    const { user, getUser } = useContext(UserContext);

    useEffect(async () => {
      if (!user) {
        const currentUser = await getUser();
        if (!currentUser) {
          // console.log('NO CURRENT USER!!!');
          router.push('/login');
        }
      }
    }, []);

    return user ? <WrappedComponent {...props} /> : <Fragment />;
  };

  return RequiresAuthentication;
};

withAuthentication.propTypes = {
  WrappedComponent: PropTypes.node.isRequired,
};

export default withAuthentication;
