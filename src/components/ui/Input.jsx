import React from 'react';

const Input = ({ 
  label,
  icon: Icon,
  error,
  success,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props 
}) => {
  const hasIcon = !!Icon;
  const hasError = !!error;
  const hasSuccess = !!success;

  const inputClasses = [
    'sidebar-item block w-full appearance-none rounded-xl border bg-white bg-clip-padding',
    'py-3 font-medium text-slate-700 transition-all',
    'focus:outline-none focus:transition-shadow text-sm leading-5.6 ease-nav-brand',
    hasIcon ? 'pl-12' : 'px-4',
    hasError 
      ? 'border-red-300 focus:border-red-400 focus:shadow-soft-xl hover:border-red-400'
      : hasSuccess
        ? 'border-green-300 focus:border-green-400 focus:shadow-soft-xl hover:border-green-400'
        : 'border-gray-200 focus:border-indigo-400 focus:shadow-soft-xl hover:border-indigo-300',
    className
  ].join(' ');

  const iconClasses = [
    'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
    hasError 
      ? 'text-red-400'
      : hasSuccess
        ? 'text-green-400'
        : 'text-slate-400'
  ].join(' ');

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`flex items-center space-x-2 text-sm font-semibold text-slate-700 ${labelClassName}`}>
          {Icon && <Icon className="w-4 h-4 text-slate-600" />}
          <span>{label}</span>
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className={iconClasses} />
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {hasSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      
      {success && (
        <p className="text-sm text-green-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{success}</span>
        </p>
      )}
    </div>
  );
};

export default Input;