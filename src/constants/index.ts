export const JIRA_FIELDS = {
  STORY_POINTS: 'customfield_10410',
  PLANNED_WEEK_DAY: 'customfield_16163',
} as const;

export const STORAGE_KEYS = {
  JIRA_CONFIG: 'jira_config',
} as const;

export const FILE_ACCEPT = '.csv,.xlsx,.xls';
export const MAX_CONCURRENT_REQUESTS = 3;