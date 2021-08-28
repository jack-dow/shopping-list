import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import { setSession } from '../redux/slices/userSlice';
import { supabase } from '../lib/initSupabase';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && isProcessing && session) {
        dispatch(setSession(session));
        setIsProcessing(false);
        router.push('/');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [isProcessing]);

  useEffect(() => {
    if (loginError) {
      setLoginError();
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    if (email && password) {
      e.preventDefault();
      setIsProcessing(true);

      const { error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        console.log(error.message);
        setLoginError(error.message);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen shadow bg-gray-50 dark:bg-true-gray-900 overflow-hidden sm:px-6 lg:px-8 transition">
      <NextSeo title="Login | TKIT Shopping List" />
      {/* <div className="absolute top-6 right-10">
        <DarkModeToggle />
      </div> */}
      <div className="max-w-md h-1/4 p-8 pt-16 flex justify-center items-center">
        <div className="w-3/4">
          <img
            src="/login.svg"
            alt="Man entering door"
            className="max-w-full max-h-full w-full h-full"
          />
        </div>
      </div>
      <div className="max-w-md mt-8 w-full flex-1 flex">
        <div className="bg-white flex-1 dark:bg-true-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="pb-4 text-center text-3xl font-extrabold text-gray-900 dark:text-true-gray-50 transition-colors">
              Sign in
            </h2>
          </div>
          <form className="space-y-4">
            <Input
              label="Email address"
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              showError={!!loginError}
            />
            <div>
              <Input
                label="Password"
                placeholder="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showError={!!loginError}
              />

              {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              disabled={isProcessing}
              className="group relative w-full space-x-2 flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 dark:focus:ring-sky-700 transition disabled:opacity-80 disabled:bg-sky-600 disabled:cursor-not-allowed"
            >
              {isProcessing && <Spinner />}
              {!isProcessing ? 'Continue' : <span>Signing you in</span>}
            </button>
            <p className="mt-2 font-medium text-center text-sm text-gray-600 dark:text-true-gray-400 max-w transition-colors">
              Don&apos;t have an account?
              <Link href="/register">
                <a
                  href="/register"
                  className="font-semibold pl-1 text-sky-600 hover:text-sky-500 dark:hover:text-sky-600 hover:underline focus:outline-none foucs:underline transition-colors"
                >
                  Register here
                </a>
              </Link>
            </p>
          </form>
          {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-true-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 dark:bg-true-gray-800 dark:text-true-gray-300 transition-colors">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const user = supabase.auth.user();
                      console.log(user);
                    }}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-true-gray-300 rounded-md shadow-sm bg-white dark:bg-true-gray-800 text-sm font-medium text-true-gray-500 dark:text-true-gray-300 hover:bg-gray-50 dark:hover:bg-true-gray-900 focus:bg-gray-50 dark:focus:bg-true-gray-900 transition"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      const { user, error } = await supabase.auth.signIn({
                        provider: 'google',
                      });

                      if (error) {
                        console.log(error);
                      }

                      console.log(user);
                    }}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-true-gray-300 rounded-md shadow-sm bg-white dark:bg-true-gray-800 text-sm font-medium text-true-gray-500 dark:text-true-gray-300 hover:bg-gray-50 dark:hover:bg-true-gray-900 focus:bg-gray-50 dark:focus:bg-true-gray-900 transition"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0)" fill="currentColor">
                        <path d="M19.603 10.23c0-.68-.055-1.364-.173-2.032H9.998v3.85H15.4a4.629 4.629 0 01-2 3.04v2.498h3.223c1.893-1.742 2.98-4.314 2.98-7.356z" />
                        <path d="M9.998 20c2.697 0 4.972-.886 6.629-2.414l-3.223-2.499c-.896.61-2.054.956-3.402.956-2.609 0-4.821-1.76-5.615-4.127H1.062v2.576A10.001 10.001 0 009.998 20z" />
                        <path d="M4.384 11.916a5.99 5.99 0 010-3.828V5.512H1.062a10.009 10.009 0 000 8.98l3.322-2.576z" />
                        <path d="M9.998 3.957a5.434 5.434 0 013.836 1.5L16.69 2.6A9.61 9.61 0 0010 0a9.998 9.998 0 00-8.937 5.512l3.322 2.575c.79-2.37 3.005-4.13 5.614-4.13z" />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <path fill="currentColor" d="M0 0h19.603v20H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
}
