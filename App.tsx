
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import PreviewTable from './components/PreviewTable';
import { parseCSV } from './services/csvParser';

// Make SheetJS library available in the window scope
declare const XLSX: any;

export interface ColumnMapping {
  originalIndex: number;
  newHeader: string;
  include: boolean;
}

const App: React.FC = () => {
  const [csvText, setCsvText] = useState<string>('');
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted_data');
  const [delimiter, setDelimiter] = useState<'auto' | ',' | ';' | '\t'>('auto');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const resetState = useCallback(() => {
    setData([]);
    setError(null);
    setColumnMapping([]);
    setValidationErrors([]);
  }, []);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(event.target.value);
    resetState();
  }, [resetState]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvText(text);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        resetState();
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setCsvText('');
        resetState();
        setFileName('converted_data');
      };
      reader.readAsText(file);
    }
  }, [resetState]);

  const validateData = (parsedData: string[][]): string[] => {
    const errors: string[] = [];
    if (parsedData.length < 2) return errors; // Not enough data to validate

    const headerColumnCount = parsedData[0].length;
    parsedData.forEach((row, index) => {
      if (index > 0 && row.length !== headerColumnCount) {
        errors.push(`Row ${index + 1} has ${row.length} columns, but the header has ${headerColumnCount}.`);
      }
    });
    return errors;
  };
  
  const handlePreview = useCallback(() => {
    resetState();
    if (!csvText.trim()) {
      setError('Input is empty. Please paste CSV data or upload a file.');
      return;
    }
    try {
      const parsedData = parseCSV(csvText, delimiter);
      if (parsedData.length === 0 || (parsedData.length === 1 && parsedData[0].length <= 1 && parsedData[0][0] === '')) {
          setError('Could not parse any data. Please check the CSV format and selected delimiter.');
      } else {
          const validation = validateData(parsedData);
          if (validation.length > 0) {
            setValidationErrors(validation);
          }
          setData(parsedData);
          setColumnMapping(
            parsedData[0].map((header, index) => ({
              originalIndex: index,
              newHeader: header,
              include: true,
            }))
          );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown parsing error occurred.');
    }
  }, [csvText, delimiter, resetState]);

  const handleDownload = useCallback(() => {
    if (data.length === 0 || validationErrors.length > 0) {
      setError('Please fix validation errors before downloading.');
      return;
    }

    const includedColumns = columnMapping.filter(col => col.include);
    if (includedColumns.length === 0) {
      setError('No columns selected for download.');
      return;
    }

    const header = includedColumns.map(col => col.newHeader);
    const indices = includedColumns.map(col => col.originalIndex);
    
    const dataToExport = [header];
    const bodyRows = data.slice(1);
    
    bodyRows.forEach(row => {
      const newRow = indices.map(i => row[i] !== undefined ? row[i] : '');
      dataToExport.push(newRow);
    });

    try {
      const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (err) {
      setError('Failed to generate Excel file.');
    }
  }, [data, fileName, columnMapping, validationErrors]);
  
  const handleClear = useCallback(() => {
    setCsvText('');
    resetState();
    setFileName('converted_data');
    setDelimiter('auto');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }, [resetState]);

  const handleMappingChange = useCallback((updatedMapping: ColumnMapping[]) => {
    setColumnMapping(updatedMapping);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <InputArea
            csvText={csvText}
            onTextChange={handleTextChange}
            onFileChange={handleFileChange}
            onPreview={handlePreview}
            onClear={handleClear}
            fileName={fileName === 'converted_data' && csvText ? 'pasted_data' : fileName}
            delimiter={delimiter}
            onDelimiterChange={setDelimiter}
          />
          <PreviewTable
            data={data}
            error={error}
            onDownload={handleDownload}
            columnMapping={columnMapping}
            onMappingChange={handleMappingChange}
            validationErrors={validationErrors}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
