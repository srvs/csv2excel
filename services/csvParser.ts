
const autoDetectDelimiter = (text: string): ',' | ';' | '\t' => {
  const delimiters = [',', ';', '\t'] as const;
  const sample = text.slice(0, 1024); // Analyze the first 1KB
  const lines = sample.split('\n').slice(0, 10); // Use up to 10 lines for detection

  if (lines.length <= 1) return ','; // Default for single-line CSV

  let bestDelimiter: ',' | ';' | '\t' = ',';
  let maxConsistentCols = 0;

  for (const delimiter of delimiters) {
    const colCounts = lines.map(line => line.split(delimiter).length);
    const firstColCount = colCounts[0];
    
    // Check if all lines have the same number of columns > 1
    const isConsistent = colCounts.every(count => count === firstColCount) && firstColCount > 1;

    if (isConsistent && firstColCount > maxConsistentCols) {
        maxConsistentCols = firstColCount;
        bestDelimiter = delimiter;
    }
  }

  // Fallback if no consistent delimiter found
  if (maxConsistentCols === 0) {
      const commaCount = (sample.match(/,/g) || []).length;
      const semicolonCount = (sample.match(/;/g) || []).length;
      const tabCount = (sample.match(/\t/g) || []).length;

      if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
      if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
  }

  return bestDelimiter;
};

export const parseCSV = (csvText: string, delimiterOption: 'auto' | ',' | ';' | '\t'): string[][] => {
  const delimiter = delimiterOption === 'auto' ? autoDetectDelimiter(csvText) : delimiterOption;
  
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let text = csvText.trim() + '\n'; // Ensure last line is processed

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // It's an escaped quote
          currentField += '"';
          i++; // Skip the next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        // End of row
        // handle CRLF by checking if next is LF
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // If the file doesn't end with a newline, there might be a row left
  if (currentRow.length > 0) {
      rows.push(currentRow);
  }

  return rows;
};
