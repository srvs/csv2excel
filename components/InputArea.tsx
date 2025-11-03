
import React from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface InputAreaProps {
  csvText: string;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: () => void;
  onClear: () => void;
  fileName: string;
  delimiter: 'auto' | ',' | ';' | '\t';
  onDelimiterChange: (delimiter: 'auto' | ',' | ';' | '\t') => void;
}

const DelimiterOption: React.FC<{
  value: 'auto' | ',' | ';' | '\t',
  label: string,
  current: string,
  onChange: (value: any) => void
}> = ({ value, label, current, onChange }) => (
  <label className="inline-flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      name="delimiter"
      value={value}
      checked={current === value}
      onChange={(e) => onChange(e.target.value)}
      className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-600 dark:border-slate-500"
    />
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

const InputArea: React.FC<InputAreaProps> = ({
  csvText,
  onTextChange,
  onFileChange,
  onPreview,
  onClear,
  fileName,
  delimiter,
  onDelimiterChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">1. Provide your CSV Data</h2>
      
      <div className="mb-4">
        <label htmlFor="csv-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          Paste CSV data here:
        </label>
        <textarea
          id="csv-input"
          value={csvText}
          onChange={onTextChange}
          placeholder="e.g., id,name,email
1,John Doe,john.doe@example.com
2,Jane Smith,jane.smith@example.com"
          className="w-full h-48 p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white transition duration-150 ease-in-out"
          aria-label="CSV data input"
        />
      </div>

      <div className="flex items-center justify-center my-4">
        <span className="flex-grow border-t border-slate-300 dark:border-slate-600"></span>
        <span className="mx-4 text-slate-500 dark:text-slate-400 font-semibold">OR</span>
        <span className="flex-grow border-t border-slate-300 dark:border-slate-600"></span>
      </div>

      <div className="mb-4">
        <label htmlFor="file-upload" className="w-full inline-flex items-center justify-center px-4 py-2 border border-dashed border-slate-400 dark:border-slate-500 rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition">
          <UploadIcon className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Upload a .csv file</span>
        </label>
        <input id="file-upload" type="file" accept=".csv,text/csv" className="hidden" onChange={onFileChange} />
        {fileName !== 'converted_data' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">Selected file: <span className="font-medium">{fileName}.csv</span></p>}
      </div>
      
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Delimiter</h3>
        <div className="flex items-center space-x-4">
            <DelimiterOption value="auto" label="Auto-detect" current={delimiter} onChange={onDelimiterChange} />
            <DelimiterOption value="," label="Comma (,)" current={delimiter} onChange={onDelimiterChange} />
            <DelimiterOption value=";" label="Semicolon (;)" current={delimiter} onChange={onDelimiterChange} />
            <DelimiterOption value="\t" label="Tab" current={delimiter} onChange={onDelimiterChange} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onPreview}
          className="w-full sm:w-1/2 flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition"
        >
          Preview Data
        </button>
        <button
          onClick={onClear}
          disabled={!csvText}
          className="w-full sm:w-1/2 flex-grow inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default InputArea;
