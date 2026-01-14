
import React from 'react';

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    // Con un icono para llamar la atención
    <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600 dark:text-red-400 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
        <span>{children}</span>
    </div>
  );
}