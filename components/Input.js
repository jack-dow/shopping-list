import { EyeIcon, EyeOffIcon } from '@iconicicons/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function Input({
  label,
  id,
  name,
  type,
  inputMode,
  pattern,
  value,
  placeholder,
  min,
  max,
  maxLength,
  onChange,
  onKeyDown,
  onKeyPress,
  onFocus,
  onBlur,
  iconLeading,
  iconTrailing,
  price,
  required,
  helpText,
  showError,
  errorText,
  autoComplete,
}) {
  const [showingPassword, setShowingPassword] = useState(false);

  return (
    <div
      className={classNames({
        'text-true-gray-500 focus-within:text-true-gray-300 transition': iconLeading,
      })}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-true-gray-400 transition-colors"
        >
          {label}
        </label>
      )}
      <div
        className={classNames({
          'mt-1': label,
          'relative rounded-md shadow-sm':
            iconLeading || price || type === 'password' || iconTrailing,
        })}
      >
        {iconLeading && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {iconLeading}
          </div>
        )}
        {price && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-true-gray-300 sm:text-sm transition-colors">
              $
            </span>
          </div>
        )}
        <input
          type={type === 'password' && showingPassword ? 'text' : type}
          name={name}
          id={id}
          inputMode={inputMode}
          pattern={pattern}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onFocus={onFocus}
          onBlur={onBlur}
          className={classNames(
            'shadow-sm block w-full p-3 text-sm rounded-md focus:ring-2 dark:bg-true-gray-900 dark:text-true-gray-300 dark:placeholder-true-gray-400 transition',
            {
              'pl-10': iconLeading,
              'pr-10': iconTrailing,
              'pl-6 pr-12 ': price,
              'border-red-600 focus:border-red-600 focus:ring-red-600': showError,
              'border-gray-300 dark:border-true-gray-600 focus:border-transparent focus:ring-light-blue-600 dark:focus:border-light-blue-700':
                !showError,
            }
          )}
          placeholder={placeholder}
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-true-gray-600 dark:hover:text-true-gray-50 focus:text-true-gray-600 dark:focus:text-true-gray-50 focus:outline-none transition"
            onClick={() => setShowingPassword(!showingPassword)}
          >
            {showingPassword && <EyeOffIcon className="w-6 h-6" />}
            {!showingPassword && <EyeIcon className="w-6 h-6" />}
          </button>
        )}
        {price && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span
              className="text-gray-500 dark:text-true-gray-300 sm:text-sm transition-colors"
              id="price-currency"
            >
              AUD
            </span>
          </div>
        )}
        {iconTrailing && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{iconTrailing}</div>
        )}
      </div>
      {(helpText || (errorText && showError)) && (
        <p
          className={`mt-1 text-sm ${helpText && 'text-gray-500 dark:text-true-gray-400'} ${
            errorText && 'text-red-600 dark:text-red-500'
          } transition-colors`}
        >
          {helpText || errorText}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  iconLeading: PropTypes.shape(),
  price: PropTypes.bool,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  showError: PropTypes.bool,
  errorText: PropTypes.string,
};

Input.defaultProps = {
  label: '',
  type: 'text',
  placeholder: '',
  maxLength: 524288,
  onKeyDown: null,
  onBlur: null,
  iconLeading: null,
  price: false,
  required: false,
  helpText: null,
  showError: false,
  errorText: null,
};
