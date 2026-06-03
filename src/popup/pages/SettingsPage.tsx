import { useState, useEffect } from 'react';
import { JiraConfig } from '../../types';
import { getJiraConfig, saveJiraConfig } from '../../storage';
import { validateConnection } from '../../services/jiraService';

interface Props {
  onSaved: () => void;
}

export function SettingsPage({ onSaved }: Props) {
  const [config, setConfig] = useState<JiraConfig>({
    baseUrl: '',
    email: '',
    apiToken: '',
  });
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getJiraConfig().then((saved) => {
      if (saved) setConfig(saved);
    });
  }, []);

  const handleSave = async () => {
    if (!config.baseUrl || !config.email || !config.apiToken) {
      setStatus('error');
      setMessage('Tüm alanları doldurun');
      return;
    }
    setTesting(true);
    setStatus('idle');
    const ok = await validateConnection(config);
    setTesting(false);
    if (ok) {
      await saveJiraConfig(config);
      setStatus('success');
      setMessage('Bağlantı başarılı, ayarlar kaydedildi');
      setTimeout(onSaved, 1000);
    } else {
      setStatus('error');
      setMessage('Bağlantı kurulamadı. URL, email veya token\'ı kontrol edin');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>
        ⚙️ Jira Ayarları
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Jira Base URL</label>
          <input
            type="text"
            placeholder="https://company.atlassian.net"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value.trimEnd() })}
          />
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={config.email}
            onChange={(e) => setConfig({ ...config, email: e.target.value.trim() })}
          />
        </div>

        <div>
          <label style={labelStyle}>API Token</label>
          <input
            type="password"
            placeholder="Jira API token"
            value={config.apiToken}
            onChange={(e) => setConfig({ ...config, apiToken: e.target.value.trim() })}
          />
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
			  Token oluşturmak için:{' '}
			  <a
				href="https://id.atlassian.com/manage-profile/security/api-tokens"
				target="_blank"
				rel="noreferrer"
				style={{ color: '#3b82f6' }}
			  >
				id.atlassian.com
			  </a>
			</p>
        </div>

        {message && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            background: status === 'success' ? '#f0fdf4' : '#fef2f2',
            color: status === 'success' ? '#16a34a' : '#dc2626',
            border: `1px solid ${status === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={testing}
          style={{ background: '#3b82f6', color: '#fff', padding: '10px' }}
        >
          {testing ? 'Bağlantı test ediliyor...' : 'Kaydet ve Test Et'}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
};