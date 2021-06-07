import React, { createContext, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { snakeToCamelCase } from '../utils/caseTransform';
import { supabase } from '../utils/initSupabase';
import Toast from '../components/Toast';

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

      Toast({ text: 'An unexpected error occured. Please try again later' });

      return null;
    }

    return snakeToCamelCase(data);
  };

  const getUser = async (type) => {
    return null;
    const loggedInUser = supabase.auth.user();

    if (loggedInUser) {
      const userProfile = await useQuery(
        supabase
          .from(type === 'staff' ? 'staff' : 'users')
          .select('*')
          .match({ id: loggedInUser.id })
          .single()
      );

      setUser(userProfile);
      return userProfile;
    }

    return null;
  };

  useEffect(async () => {
    if (!user) {
      const currentUser = await getUser();

      if (currentUser) {
        setUseDarkMode(currentUser.darkMode);
      } else if (window.localStorage.getItem('darkMode')) {
        setUseDarkMode(JSON.parse(window.localStorage.getItem('darkMode')));
      } else {
        setUseDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    } else {
      setUseDarkMode(user.darkMode);
    }
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Provider value={{ user, getUser, logout, setUser, useDarkMode, setUseDarkMode, useQuery }}>
      {useDarkMode == null ? (
        <Fragment />
      ) : (
        <div className={useDarkMode ? 'dark' : 'light'}>{children}</div>
      )}
    </Provider>
  );
};

export { UserContext, UserProvider };
