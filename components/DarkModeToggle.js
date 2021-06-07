import classNames from 'classnames';
import { useContext } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';

import { UserContext } from '../lib/UserContext';
import { supabase } from '../utils/initSupabase';

export default function DarkModeToggle() {
  const { useDarkMode, setUseDarkMode } = useContext(UserContext);
  const { user, setUser, useQuery } = useContext(UserContext);

  return (
    <button
      type="button"
      onClick={async () => {
        if (user) {
          const updatedUser = await useQuery(
            supabase
              .from('users')
              .update({ dark_mode: !useDarkMode })
              .match({ id: user.id })
              .single()
          );
          setUser(updatedUser);
        }
        window.localStorage.setItem('darkMode', !useDarkMode);
        setUseDarkMode(!useDarkMode);
      }}
      className="bg-gray-200 relative inline-flex flex-shrink-0 h-7 w-14 border-2 border-transparent rounded-full cursor-pointer transition ease-in-out dark:ring-offset-true-gray-900 duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-700 dark:focus:ring-light-blue-700 dark:bg-true-gray-700"
      aria-pressed="false"
    >
      <span className="sr-only">Toggle Darkmode</span>

      <span
        className={classNames(
          'pointer-events-none relative inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 dark:bg-true-gray-800',
          {
            'translate-x-7': useDarkMode,
            'translate-x-0': !useDarkMode,
          }
        )}
      >
        <span
          className={classNames(
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ',
            {
              'opacity-0 ease-out duration-100': useDarkMode,
              'opacity-100 ease-in duration-200': !useDarkMode,
            }
          )}
          aria-hidden="true"
        >
          <SunIcon className="h-3 w-3 text-light-blue-700" />
        </span>
        {/* <!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" --> */}
        <span
          className={classNames(
            'ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
            {
              'opacity-100 ease-in duration-200': useDarkMode,
              'opacity-0 ease-out duration-100': !useDarkMode,
            }
          )}
          aria-hidden="true"
        >
          <MoonIcon className="h-3 w-3 text-white" />
        </span>
      </span>
    </button>
  );
}
