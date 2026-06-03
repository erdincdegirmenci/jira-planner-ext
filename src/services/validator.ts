import { IssueRow, ValidationResult, JiraConfig } from '../types';
import { getIssue, resolveAccountId } from './jiraService';

export async function validateRow(
  config: JiraConfig,
  row: IssueRow,
  dryRun: boolean
): Promise<ValidationResult> {
  const errors: string[] = [];
  let assigneeAccountId: string | undefined;

  if (isNaN(row.storyPoints) || row.storyPoints < 0) {
    errors.push('Story Points geçersiz');
  }

  if (!row.plannedWeekDay.trim()) {
    errors.push('Planned Week Day boş');
  }

  if (!dryRun) {
    const issueExists = await getIssue(config, row.issueKey);
    if (!issueExists) {
      errors.push(`${row.issueKey} Jira'da bulunamadı`);
    }

    const accountId = await resolveAccountId(config, row.assigneeEmail);
    if (!accountId) {
      errors.push(`${row.assigneeEmail} kullanıcısı bulunamadı`);
    } else {
      assigneeAccountId = accountId;
    }
  }

  return {
    ...row,
    isValid: errors.length === 0,
    errors,
    assigneeAccountId,
  };
}

export async function validateAll(
  config: JiraConfig,
  rows: IssueRow[],
  dryRun: boolean,
  onProgress?: (current: number, total: number) => void
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = await validateRow(config, rows[i], dryRun);
    results.push(result);
    onProgress?.(i + 1, rows.length);
  }

  return results;
}