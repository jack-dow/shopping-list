import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import { fetchAllItems } from '../redux/slices/itemsSlice';
import { logout } from '../redux/slices/userSlice';

function Test() {
  const { items } = useSelector((state) => state.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllItems(true));
  }, []);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <Layout>
      <div>Im a layout!</div>
      <button type="button" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </Layout>
  );
}

export default withAuthentication(Test);
