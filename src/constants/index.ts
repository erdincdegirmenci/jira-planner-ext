export const JIRA_FIELDS = {
  STORY_POINTS: 'customfield_10343',
  PLANNED_WEEK_DAY: 'customfield_16163',
} as const;

export const PLANNED_WEEK_OPTIONS: Record<string, string> = {
  '1': '31181',
  '2': '31182',
  '3': '31183',
  '4': '31184',
  '5': '31185',
  '6': '31186',
  '7': '31187',
  '8': '55440',
};

export const STORAGE_KEYS = {
  JIRA_CONFIG: 'jira_config',
} as const;

export const FILE_ACCEPT = '.csv,.xlsx,.xls';
export const MAX_CONCURRENT_REQUESTS = 3;