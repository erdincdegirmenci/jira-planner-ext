export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export interface IssueRow {
  issueKey: string;
  assigneeEmail: string;
  storyPoints: number;
  plannedWeekDay: string;
}

export interface ParseResult {
  rows: IssueRow[];
  errors: ParseError[];
  totalRows: number;
}

export interface ParseError {
  row: number;
  field: string;
  message: string;
}

export interface ValidationResult {
  issueKey: string;
  assigneeEmail: string;
  storyPoints: number;
  plannedWeekDay: string;
  isValid: boolean;
  errors: string[];
  assigneeAccountId?: string;
}

export interface UpdateResult {
  issueKey: string;
  success: boolean;
  error?: string;
}

export interface ExecutionReport {
  total: number;
  updated: number;
  failed: number;
  results: UpdateResult[];
}

export type AppPage =
  | 'settings'
  | 'upload'
  | 'preview'
  | 'validation'
  | 'progress'
  | 'report';