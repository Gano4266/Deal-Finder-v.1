import { readFile } from "node:fs/promises";

export type CsvRow = Record<string, string>;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  if (inQuotes) {
    throw new Error(`Malformed CSV row: unterminated quoted field`);
  }
  return values;
}

export function parseCsv(text: string): CsvRow[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
  if (!normalized) {
    return [];
  }

  const [headerLine, ...lines] = normalized.split("\n");
  const headers = parseCsvLine(headerLine);

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      const values = parseCsvLine(line);
      if (values.length !== headers.length) {
        throw new Error(`CSV row ${index + 2} has ${values.length} fields, expected ${headers.length}`);
      }

      return headers.reduce<CsvRow>((row, header, index) => {
        row[header] = values[index] ?? "";
        return row;
      }, {});
    });
}

export async function readCsv(filePath: string): Promise<CsvRow[]> {
  const text = await readFile(filePath, "utf8");
  return parseCsv(text);
}
