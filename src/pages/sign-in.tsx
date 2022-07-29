import type { NextPage } from 'next';
import { forwardRef, useReducer, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { supabase } from '../utils/supabaseClient';

interface FormValues {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit(async ({ email, password }) => {
    setIsLoading(true);
    const { session, error } = await supabase.auth.signIn({
      email,
      password,
    });
    setIsLoading(false);
    if (error) return setError(error.message);

    console.log(session);
  });
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -ml-[47.5rem] w-[122.5rem] max-w-none">
        <Image
          src="/sign-in/beams-cover@95.jpeg"
          alt=""
          width={3920}
          height={1296}
          priority
          layout="responsive"
        />
      </div>
      <div className="absolute inset-0 text-slate-900/[0.07] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-bg"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
              x="100%"
              patternTransform="translate(0 -1)"
            >
              <path d="M0 32V.5H32" fill="none" stroke="currentColor"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-bg)"></rect>
        </svg>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 mb-4 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <p className="mb-6 text-center text-xs font-medium text-red-600">
            {error === 'Invalid login credentials'
              ? 'These credentials do not match our records.'
              : error}
          </p>
        )}
        <form className="mb-12 w-full max-w-sm" onSubmit={onSubmit}>
          <Input
            label="Email address"
            type="email"
            invalid={!!error}
            {...register('email', { required: true })}
          />
          <Input
            label="Password"
            type="password"
            invalid={!!error}
            {...register('password', { required: true })}
          />
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-lg bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white transition duration-100 hover:bg-slate-700"
          >
            <span>Sign in to account</span>
          </button>
        </form>
      </div>
    </main>
  );
};

export default SignIn;

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  type: 'email' | 'password';
  invalid?: boolean;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, label, ...props }, ref) => {
    const [showingPassword, togglePassword] = useReducer(
      (prev) => !prev,
      false,
    );

    return (
      <div className="mb-6">
        <label
          htmlFor={props.type}
          className="block text-sm font-semibold leading-6 text-gray-900"
        >
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={props.type}
            required
            type={
              props.type === 'password' && showingPassword ? 'text' : props.type
            }
            className={clsx(
              'mt-2 block h-10 w-full appearance-none rounded-md bg-white px-3 text-slate-900 shadow-sm ring-1 ring-slate-200 transition duration-100',
              'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm',
              invalid && 'ring-2 ring-red-500',
            )}
          />
          {props.type === 'password' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                className="h-5 w-5"
                onClick={togglePassword}
              >
                {showingPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'SignUpInput';
