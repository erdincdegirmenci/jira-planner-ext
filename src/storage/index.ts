import { JiraConfig } from '../types';
import { STORAGE_KEYS } from '../constants';

export async function getJiraConfig(): Promise<JiraConfig | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.JIRA_CONFIG, (result) => {
      resolve(result[STORAGE_KEYS.JIRA_CONFIG] ?? null);
    });
  });
}

export async function saveJiraConfig(config: JiraConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      { [STORAGE_KEYS.JIRA_CONFIG]: config },
      resolve
    );
  });
}

export async function clearJiraConfig(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(STORAGE_KEYS.JIRA_CONFIG, resolve);
  });
}