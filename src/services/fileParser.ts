import * as XLSX from 'xlsx';
import { IssueRow, ParseResult, ParseError } from '../types';

const COLUMN_MAP: Record<string, keyof IssueRow> = {
  'issue key': 'issueKey',
  'assignee email': 'assigneeEmail',
  'story points': 'storyPoints',
  'planned week day': 'plannedWeekDay',
};

function normalizeHeader(header: string): keyof IssueRow | null {
  return COLUMN_MAP[header.toLowerCase().trim()] ?? null;
}

function parseRow(
  raw: Record<string, unknown>,
  rowIndex: number
): { row: IssueRow | null; errors: ParseError[] } {
  const errors: ParseError[] = [];
  const normalized: Partial<IssueRow> = {};

  for (const [rawKey, value] of Object.entries(raw)) {
    const field = normalizeHeader(rawKey);
    if (field) {
      normalized[field] = value as never;
    }
  }

  if (!normalized.issueKey || String(normalized.issueKey).trim() === '') {
    errors.push({ row: rowIndex, field: 'issueKey', message: 'Issue Key boş olamaz' });
  }

  if (!normalized.assigneeEmail || String(normalized.assigneeEmail).trim() === '') {
    errors.push({ row: rowIndex, field: 'assigneeEmail', message: 'Assignee Email boş olamaz' });
  }

  const sp = Number(normalized.storyPoints);
  if (isNaN(sp) || sp < 0) {
    errors.push({ row: rowIndex, field: 'storyPoints', message: 'Story Points geçerli bir sayı olmalı' });
  }

  if (!normalized.plannedWeekDay || String(normalized.plannedWeekDay).trim() === '') {
    errors.push({ row: rowIndex, field: 'plannedWeekDay', message: 'Planned Week Day boş olamaz' });
  }

  if (errors.length > 0) return { row: null, errors };

  return {
    row: {
      issueKey: String(normalized.issueKey).trim(),
      assigneeEmail: String(normalized.assigneeEmail).trim(),
      storyPoints: sp,
      plannedWeekDay: String(normalized.plannedWeekDay).trim(),
    },
    errors: [],
  };
}

export function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        const rows: IssueRow[] = [];
        const errors: ParseError[] = [];

        rawRows.forEach((raw, index) => {
          const { row, errors: rowErrors } = parseRow(raw, index + 2);
          if (row) rows.push(row);
          errors.push(...rowErrors);
        });

        resolve({ rows, errors, totalRows: rawRows.length });
      } catch {
        reject(new Error('Dosya okunamadı. Geçerli bir CSV veya XLSX dosyası yükleyin.'));
      }
    };

    reader.onerror = () => reject(new Error('Dosya okuma hatası'));
    reader.readAsBinaryString(file);
  });
}