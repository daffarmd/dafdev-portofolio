export type ParsedMarkdownTable = {
  headers: string[];
  rows: string[][];
  nextIndex: number;
};

const TABLE_SEPARATOR_CELL_PATTERN = /^:?-{3,}:?$/;

export const splitTableCells = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.includes('|')) {
    return [];
  }

  const rawCells = trimmed.split('|');
  const cells =
    trimmed.startsWith('|') && trimmed.endsWith('|')
      ? rawCells.slice(1, -1)
      : rawCells;

  return cells.map((cell) => cell.trim());
};

export const parseEditorTableHeaders = (value: string) =>
  splitTableCells(value);

export const parseEditorTableRows = (value: string) =>
  value
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map(splitTableCells)
    .filter((cells) => cells.length > 0);

export const tableToMarkdown = (headers: string[], rows: string[][]) => {
  const columnCount = Math.max(headers.length, ...rows.map((row) => row.length), 0);

  if (columnCount === 0) {
    return '';
  }

  const normalizedHeaders = Array.from({ length: columnCount }, (_, index) =>
    headers[index]?.trim() ?? '',
  );
  const headerLine = `| ${normalizedHeaders.join(' | ')} |`;
  const separatorLine = `| ${Array.from({ length: columnCount }, () => '---').join(' | ')} |`;
  const rowLines = rows.map((row) => {
    const normalizedRow = Array.from({ length: columnCount }, (_, index) =>
      row[index]?.trim() ?? '',
    );

    return `| ${normalizedRow.join(' | ')} |`;
  });

  return [headerLine, separatorLine, ...rowLines].join('\n');
};

export const isMarkdownTableRow = (line: string) => {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|');
};

export const isMarkdownTableSeparatorRow = (line: string) => {
  const cells = splitTableCells(line);

  return (
    cells.length > 0
    && cells.every((cell) => TABLE_SEPARATOR_CELL_PATTERN.test(cell.replace(/\s+/g, '')))
  );
};

export const parseMarkdownTableBlock = (
  lines: string[],
  startIndex: number,
): ParsedMarkdownTable | null => {
  if (startIndex + 1 >= lines.length) {
    return null;
  }

  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];

  if (
    !isMarkdownTableRow(headerLine)
    || !isMarkdownTableRow(separatorLine)
    || !isMarkdownTableSeparatorRow(separatorLine)
  ) {
    return null;
  }

  const headers = splitTableCells(headerLine);
  const rows: string[][] = [];
  let nextIndex = startIndex + 2;

  while (nextIndex < lines.length && isMarkdownTableRow(lines[nextIndex])) {
    rows.push(splitTableCells(lines[nextIndex]));
    nextIndex += 1;
  }

  return {
    headers,
    rows,
    nextIndex,
  };
};
