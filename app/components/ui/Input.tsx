"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const baseClasses =
  "w-full h-12 px-4 rounded-xl bg-[#f3fafd] text-slate-900 placeholder:text-slate-500 border border-transparent focus:border-[#0e7490] focus:bg-white outline-none transition-colors text-sm";

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, error, leftIcon, rightIcon, className = "", ...rest },
  ref
) {
  return (
    <label className="block">
      {label ? <span className="block mb-1.5 text-sm font-medium text-slate-700">{label}</span> : null}
      <div className="relative">
        {leftIcon ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{leftIcon}</span> : null}
        <input
          ref={ref}
          className={`${baseClasses} ${leftIcon ? "pl-11" : ""} ${rightIcon ? "pr-11" : ""} ${className}`}
          {...rest}
        />
        {rightIcon ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{rightIcon}</span> : null}
      </div>
      {error ? <span className="block mt-1 text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, className = "", ...rest },
  ref
) {
  return (
    <label className="block">
      {label ? <span className="block mb-1.5 text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea
        ref={ref}
        className={`${baseClasses} h-auto min-h-[120px] py-3 ${className}`}
        {...rest}
      />
      {error ? <span className="block mt-1 text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string };
export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { label, error, className = "", children, ...rest },
  ref
) {
  return (
    <label className="block">
      {label ? <span className="block mb-1.5 text-sm font-medium text-slate-700">{label}</span> : null}
      <select ref={ref} className={`${baseClasses} ${className}`} {...rest}>
        {children}
      </select>
      {error ? <span className="block mt-1 text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

export function Checkbox({
  label,
  checked,
  onChange,
  className = ""
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer text-sm ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#0e7490]"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}
