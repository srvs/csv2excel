
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import type { ColumnMapping } from '../App';

interface PreviewTableProps {
  data: string[][];
  error: string | null;
  onDownload: () => void;
  columnMapping: ColumnMapping[];
  onMappingChange: (mapping: ColumnMapping[]) => void;
  validationErrors: string[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data, error, onDownload, columnMapping, onMappingChange, validationErrors }) => {
  const rows = data?.slice(1) || [];
  const hasData = data.length > 0;
  const hasValidationErrors = validationErrors.length > 0;

  const handleIncludeToggle = (index: number) => {
    const newMapping = columnMapping.map((col) =>
      col.originalIndex === index ? { ...col, include: !col.include } : col
    );
    onMappingChange(newMapping);
  };

  const handleHeaderChange = (index: number, newHeader: string) => {
    const newMapping = columnMapping.map((col) =>
      col.originalIndex === index ? { ...col, newHeader: newHeader } : col
    );
    onMappingChange(newMapping);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mt-8 lg:mt-0 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">2. Preview & Download</h2>
        <button
          onClick={onDownload}
          disabled={!hasData || hasValidationErrors}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900 transition"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Download .xlsx
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {hasValidationErrors && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md mb-4" role="alert">
          <p className="font-bold">Validation Failed</p>
          <ul className="list-disc list-inside mt-1 text-sm">
            {validationErrors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
          </ul>
          {validationErrors.length > 5 && <p className="text-sm mt-1">...and {validationErrors.length - 5} more issues.</p>}
        </div>
      )}

      {hasData && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
           <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Configure Columns</h3>
           <p className="text-xs text-slate-500 dark:text-slate-400">Uncheck columns to exclude them. Click on a header name to rename it for the Excel file.</p>
        </div>
      )}

      <div className="flex-grow overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        {hasData ? (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0 z-10">
              <tr>
                {columnMapping.map(({ originalIndex, newHeader, include }) => (
                  <th key={originalIndex} scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={include}
                        onChange={() => handleIncludeToggle(originalIndex)}
                        className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-600 dark:border-slate-500"
                        aria-label={`Include column ${newHeader}`}
                      />
                      <input
                        type="text"
                        value={newHeader}
                        onChange={(e) => handleHeaderChange(originalIndex, e.target.value)}
                        className="p-1 w-full bg-transparent border-b border-transparent focus:bg-white dark:focus:bg-slate-600 focus:border-indigo-500 outline-none transition rounded-sm"
                        aria-label={`Rename column ${newHeader}`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {rows.slice(0, 100).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  {columnMapping.map(({ originalIndex, include }) => (
                    <td key={originalIndex} className={`px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 transition-colors ${!include && 'opacity-40 bg-slate-50 dark:bg-slate-700/50'}`}>
                      {row[originalIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-8">
            <p>Data preview will appear here after you click "Preview Data".</p>
          </div>
        )}
      </div>
       {hasData && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">Showing preview of first 100 data rows.</p>}
    </div>
  );
};

export default PreviewTable;
