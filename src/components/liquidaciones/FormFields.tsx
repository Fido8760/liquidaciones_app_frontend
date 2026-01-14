import React from 'react';
import type { FieldError } from 'react-hook-form';
import ErrorMessage from '../ErrorMessage';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: FieldError;
  children: React.ReactNode;
  required?: boolean;
};

export default function FormField({ label, htmlFor, error, children, required = false }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </div>
  );
}