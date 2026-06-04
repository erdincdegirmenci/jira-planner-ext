import { JiraConfig, UpdateResult } from '../types';
import { JIRA_FIELDS, PLANNED_WEEK_OPTIONS } from '../constants';

function getHeaders(config: JiraConfig): HeadersInit {
  // Jira Server/Data Center - Personal Access Token
  return {
    'Authorization': `Bearer ${config.apiToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
export async function validateConnection(config: JiraConfig): Promise<boolean> {
  try {
    const res = await fetch(`${config.baseUrl}/rest/api/2/myself`, {
      headers: getHeaders(config),
    });

    if (!res.ok) {
      console.log("Jira auth failed:", res.status);
      console.log(await res.text());
    }

    return res.ok;
  } catch (err) {
    console.error("Jira connection error:", err);
    return false;
  }
}

export async function getIssue(
  config: JiraConfig,
  issueKey: string
): Promise<boolean> {
  try {
    const res = await fetch(`${config.baseUrl}/rest/api/2/issue/${issueKey}`, {
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
      `${config.baseUrl}/rest/api/2/user/search?username=${encodeURIComponent(email)}`,
      { headers: getHeaders(config) }
    );
    if (!res.ok) return null;

    const users = await res.json() as Array<{
      key: string;
      name: string;
      emailAddress: string;
      displayName: string;
      active: boolean;
    }>;

    if (!users || users.length === 0) return null;

    // Aktif kullanıcılar arasında email ile eşleştir (case-insensitive)
    const match = users.find(
      (u) =>
        u.active &&
        u.emailAddress?.toLowerCase() === email.toLowerCase()
    );

    // Bulamazsan aktif ilk kullanıcıyı dön
    const fallback = users.find((u) => u.active);

    const user = match ?? fallback;
    if (!user) return null;

    // Jira Server: name alanını döndür (accountId değil)
    return user.name;
  } catch {
    return null;
  }
}

export async function updateIssue(
  config: JiraConfig,
  issueKey: string,
  accountId: string,
  storyPoints: number,
  plannedWeekDay: string,
  weekOptions: Record<string, string>
): Promise<UpdateResult> {
  try {
    const weekOptionId = weekOptions[plannedWeekDay.trim()];

    const fields: Record<string, unknown> = {
      assignee: { name: accountId },
      [JIRA_FIELDS.STORY_POINTS]: Number(storyPoints),
    };

    if (weekOptionId) {
      fields[JIRA_FIELDS.PLANNED_WEEK_DAY] = { id: weekOptionId };
    } else if (plannedWeekDay.trim()) {
      console.warn('Planned week option not found for:', plannedWeekDay, 'in', weekOptions);
    }

    const body = { fields };

    const res = await fetch(`${config.baseUrl}/rest/api/2/issue/${issueKey}`, {
      method: 'PUT',
      headers: getHeaders(config),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return { issueKey, success: true };
    }

    const errorData = await res.json().catch(() => ({})) as {
      errorMessages?: string[];
      errors?: Record<string, string>;
    };
    const errorMsg =
      errorData.errorMessages?.[0] ??
      Object.values(errorData.errors ?? {})[0] ??
      `HTTP ${res.status}`;

    return { issueKey, success: false, error: errorMsg };
  } catch (err) {
    return {
      issueKey,
      success: false,
      error: err instanceof Error ? err.message : 'Bilinmeyen hata',
    };
  }
}

export async function getPlannedWeekOptions(
  config: JiraConfig,
  issueKey: string
): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `${config.baseUrl}/rest/api/2/issue/${issueKey}/editmeta`,
      { headers: getHeaders(config) }
    );
    if (!res.ok) return {};

    const data = await res.json() as {
      fields: {
        customfield_16163?: {
          allowedValues?: Array<{ id: string; value: string }>;
        };
      };
    };

    const options: Record<string, string> = {};
    const allowed = data.fields?.customfield_16163?.allowedValues ?? [];
    for (const opt of allowed) {
      options[opt.value] = opt.id;
    }
    return options;
  } catch {
    return {};
  }
}