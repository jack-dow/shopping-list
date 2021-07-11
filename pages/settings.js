/* eslint-disable react/no-array-index-key */
import { useContext } from 'react';
import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import { UserContext } from '../lib/UserContext';

function Settings() {
  const { user, logout } = useContext(UserContext);

  return (
    <Layout>
      <NextSeo title="User Settings | TKIT Shopping List" />
      <div className="px-4 py-8">
        <div className="space-y-4 pb-4">
          <div className="flex items-center">
            <p className="text-3xl pr-2">⚙</p>
            <div className="truncate">
              <p className="font-medium text-gray-600 leading-4">Currently signed in as</p>
              <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default withAuthentication(Settings);
