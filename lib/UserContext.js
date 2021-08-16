import React, { createContext, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from './Store';
import Toast from '../components/Toast';
import { snakeToCamelCase } from '../utils/caseTransform';

const UserContext = createContext();
const { Provider } = UserContext;

// ********** Provider ********** //
const UserProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [useDarkMode, setUseDarkMode] = useState(null);

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const useQuery = async (query) => {
    const { data, error } = await query;

    if (error) {
      console.log(error);
      if (error.message === 'JWT expired') {
        logout();
        router.push('/login');
        Toast({
          text: `Session expired. Please login again.`,
        });
      }

      Toast({ text: 'An error occured. Please try again later' });

      return null;
    }

    return snakeToCamelCase(data);
  };

  const getUser = async (type) => {
    const loggedInUser = supabase.auth.user();

    if (!loggedInUser) {
      router.push('/login');
      return null;
    }

    if (user) {
      return user;
    }

    const userProfile = await useQuery(
      supabase
        .from(type === 'staff' ? 'staff' : 'users')
        .select('*')
        .match({ id: loggedInUser.id })
        .single()
    );

    setUser(userProfile);

    return userProfile;
  };

  useEffect(() => {
    if (!useDarkMode) {
      setUseDarkMode(false);
      // if (user) {
      //   setUseDarkMode(user.darkMode);
      // } else {
      //   setUseDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      // }
    }
  }, []);

  return (
    <Provider value={{ user, getUser, logout, setUser, useDarkMode, setUseDarkMode, useQuery }}>
      {useDarkMode == null ? (
        <Fragment />
      ) : (
        <div className={`max-w-screen-sm ${useDarkMode ? 'dark' : 'light'}`}>{children}</div>
      )}
    </Provider>
  );
};

export { UserContext, UserProvider };
