
import React from 'react';
import { TableIcon } from './icons/TableIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <TableIcon className="h-10 w-10 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CSV to Excel Converter</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paste or upload CSV, preview, and download as .xlsx</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
