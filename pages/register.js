import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { NextSeo } from 'next-seo';

import Input from '../components/Input';
import { supabase } from '../lib/Store';
import { camelToSnakeCase } from '../utils/caseTransform';
import { UserContext } from '../lib/UserContext';

export default function Register() {
  const router = useRouter();
  const { useDarkMode, useQuery } = useContext(UserContext);

  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [registrationError, setRegistrationError] = useState();

  const handleRegister = async (e) => {
    const { email, password, name } = fields;

    if (email && password && name) {
      e.preventDefault();

      setIsProcessing(true);

      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message) {
          setRegistrationError(error.message);
        }

        console.log(error);
        setIsProcessing(false);
        return;
      }

      const userInfo = await useQuery(
        supabase
          .from('users')
          .insert(
            camelToSnakeCase([
              {
                id: user.id,
                email,
                name,
                darkMode: useDarkMode,
              },
            ])
          )
          .single()
      );

      if (userInfo) {
        router.push('/');
      }

      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    if (registrationError) setRegistrationError();

    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen shadow bg-gray-50 dark:bg-true-gray-900 overflow-hidden sm:px-6 lg:px-8 transition">
      <NextSeo title="Register | TKIT Shopping List" />
      {/* <div className="absolute top-6 right-10">
        <DarkModeToggle />
      </div> */}
      <div className="h-1/4 p-8 pt-16 flex justify-center items-center">
        <div className="w-3/4">
          <img
            src="/register.svg"
            alt="Man entering door"
            className="max-w-full max-h-full w-full h-full"
          />
        </div>
      </div>

      <div className="mt-8 w-full flex-1 flex">
        <div className="bg-white flex-1 dark:bg-true-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors">
          <div className="pb-4 sm:mx-auto sm:w-full sm:max-w-lg">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-true-gray-50 transition-colors">
              Create your account
            </h2>
          </div>
          <form className="space-y-4">
            {registrationError && (
              <p className="text-red-600 text-sm transition">{registrationError}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={fields.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={fields.email}
                onChange={handleChange}
                showError={
                  registrationError === 'A user with this email address has already been registered'
                }
                required
              />
            </div>

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              required
            />
            <div>
              <button
                type="submit"
                onClick={handleRegister}
                disabled={isProcessing}
                className={classNames(
                  'group relative w-full mt-6 flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 dark:focus:ring-sky-700  transition',
                  {
                    'disabled:opacity-80 disabled:bg-sky-700 disabled:cursor-not-allowed':
                      isProcessing,
                  }
                )}
              >
                {isProcessing && (
                  <svg
                    className="animate-spin mr-2 -ml-1 h-4 w-4 text-white"
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
                )}
                Creat{isProcessing ? 'ing' : 'e'} account
              </button>
            </div>
            <p className="mt-2 font-medium text-center text-sm text-gray-600 dark:text-true-gray-400 max-w transition-colors">
              Existing account?
              <Link href="/login">
                <a
                  href="/login"
                  className="font-semibold pl-1 text-sky-600 hover:text-sky-500 dark:hover:text-sky-600 hover:underline focus:outline-none foucs:underline transition-colors"
                >
                  Sign in instead
                </a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
