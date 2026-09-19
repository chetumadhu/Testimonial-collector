import React from 'react';

export const Input = ({ label, error, className = '', helperText, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm transition duration-150 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 focus:ring-rose-500/30 dark:border-rose-700'
            : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', helperText, rows = 4, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm transition duration-150 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 focus:ring-rose-500/30 dark:border-rose-700'
            : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-800'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};
