import { JiraConfig, UpdateResult } from '../types';
import { JIRA_FIELDS } from '../constants';

function getHeaders(config: JiraConfig): HeadersInit {
  return {
    Authorization: `Bearer ${config.apiToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}
export async function validateConnection(config: JiraConfig): Promise<boolean> {
  try {
    const res = await fetch(`${config.baseUrl}/rest/api/3/myself`, {
      headers: getHeaders(config),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getIssue(
  config: JiraConfig,
  issueKey: string
): Promise<boolean> {
  try {
    const res = await fetch(`${config.baseUrl}/rest/api/3/issue/${issueKey}`, {
      headers: getHeaders(config),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resolveAccountId(
  config: JiraConfig,
  email: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${config.baseUrl}/rest/api/3/user/search?query=${encodeURIComponent(email)}`,
      { headers: getHeaders(config) }
    );
    if (!res.ok) return null;

    const users = await res.json() as Array<{ accountId: string; emailAddress: string }>;
    const match = users.find(
      (u) => u.emailAddress?.toLowerCase() === email.toLowerCase()
    );
    return match?.accountId ?? null;
  } catch {
    return null;
  }
}

export async function updateIssue(
  config: JiraConfig,
  issueKey: string,
  accountId: string,
  storyPoints: number,
  plannedWeekDay: string
): Promise<UpdateResult> {
  try {
    const body = {
      fields: {
        assignee: { accountId },
        [JIRA_FIELDS.STORY_POINTS]: storyPoints,
        [JIRA_FIELDS.PLANNED_WEEK_DAY]: plannedWeekDay,
      },
    };

    const res = await fetch(`${config.baseUrl}/rest/api/3/issue/${issueKey}`, {
      method: 'PUT',
      headers: getHeaders(config),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return { issueKey, success: true };
    }

    const errorData = await res.json().catch(() => ({})) as { errorMessages?: string[] };
    return {
      issueKey,
      success: false,
      error: errorData.errorMessages?.[0] ?? `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      issueKey,
      success: false,
      error: err instanceof Error ? err.message : 'Bilinmeyen hata',
    };
  }
}