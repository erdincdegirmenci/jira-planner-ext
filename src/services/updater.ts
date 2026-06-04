import { ValidationResult, UpdateResult, ExecutionReport, JiraConfig } from '../types';
import { updateIssue, getPlannedWeekOptions } from './jiraService';
import { MAX_CONCURRENT_REQUESTS } from '../constants';

async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>,
  onProgress?: (current: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    onProgress?.(Math.min(i + batchSize, items.length), items.length);
  }
  return results;
}

export async function applyUpdates(
  config: JiraConfig,
  validRows: ValidationResult[],
  onProgress?: (current: number, total: number) => void
): Promise<ExecutionReport> {
  const eligible = validRows.filter((r) => r.isValid && r.assigneeAccountId);

  const results = await processInBatches<ValidationResult, UpdateResult>(
    eligible,
    MAX_CONCURRENT_REQUESTS,
    async (row) => {
      // Her issue için dinamik olarak option ID'lerini çek
      const weekOptions = await getPlannedWeekOptions(config, row.issueKey);
      return updateIssue(
        config,
        row.issueKey,
        row.assigneeAccountId!,
        row.storyPoints,
        row.plannedWeekDay,
        weekOptions
      );
    },
    onProgress
  );

  return {
    total: validRows.length,
    updated: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}