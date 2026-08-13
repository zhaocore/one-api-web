import { ReactNode } from 'react';

export default function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1.5 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:bg-white [&_input]:px-3 [&_input]:py-2.5 [&_input]:outline-none [&_input]:focus:border-indigo-500 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:outline-none [&_textarea]:focus:border-indigo-500 dark:[&_input]:border-slate-700 dark:[&_input]:bg-slate-900 dark:[&_textarea]:border-slate-700 dark:[&_textarea]:bg-slate-900">
        {children}
      </div>
    </label>
  );
}
