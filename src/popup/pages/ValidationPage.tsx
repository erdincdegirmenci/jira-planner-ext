import { useState } from 'react';
import { IssueRow, ValidationResult, JiraConfig } from '../../types';
import { validateAll } from '../../services/validator';

interface Props {
  rows: IssueRow[];
  config: JiraConfig;
  onApply: (results: ValidationResult[]) => void;
  onBack: () => void;
}

export function ValidationPage({ rows, config, onApply, onBack }: Props) {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dryRun, setDryRun] = useState(true);
  const [done, setDone] = useState(false);

  const handleValidate = async () => {
    setRunning(true);
    setDone(false);
    setResults([]);
    const res = await validateAll(config, rows, dryRun, (current, total) => {
      setProgress(Math.round((current / total) * 100));
    });
    setResults(res);
    setRunning(false);
    setDone(true);
  };

  const valid = results.filter((r) => r.isValid).length;
  const invalid = results.filter((r) => !r.isValid).length;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>✅ Doğrulama</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <input
          type="checkbox"
          id="dryrun"
          checked={dryRun}
          onChange={(e) => setDryRun(e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label htmlFor="dryrun" style={{ fontSize: '13px', cursor: 'pointer' }}>
          <strong>Dry Run</strong> — Jira'ya bağlanmadan sadece format kontrolü yap
        </label>
      </div>

      {!done && !running && (
        <button onClick={handleValidate} style={{ width: '100%', background: '#8b5cf6', color: '#fff', padding: '10px' }}>
          Doğrulamayı Başlat
        </button>
      )}

      {running && (
        <div>
          <div style={{ background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', height: '8px', marginBottom: '8px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.2s' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>{progress}% tamamlandı</p>
        </div>
      )}

      {done && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <StatCard label="Toplam" value={results.length} color="#3b82f6" />
            <StatCard label="Geçerli" value={valid} color="#16a34a" />
            <StatCard label="Geçersiz" value={invalid} color="#dc2626" />
          </div>

          {invalid > 0 && (
            <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #fecaca', borderRadius: '8px' }}>
              {results.filter((r) => !r.isValid).map((r, i) => (
                <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #fef2f2', fontSize: '12px' }}>
                  <strong style={{ color: '#dc2626' }}>{r.issueKey}</strong>
                  {r.errors.map((e, j) => <span key={j} style={{ color: '#64748b' }}> · {e}</span>)}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBack} style={{ background: '#f1f5f9', color: '#475569', flex: 1 }}>
              ← Geri
            </button>
           <button
			  onClick={() => onApply(results)}
			  disabled={valid === 0 || dryRun}
			  style={{ background: dryRun ? '#94a3b8' : '#16a34a', color: '#fff', flex: 2 }}
			>
			  {dryRun ? 'Dry Run — Güncelleme devre dışı' : `${valid} Kaydı Güncelle →`}
		</button>
          </div>
        </>
      )}

      {!done && !running && (
        <button onClick={onBack} style={{ width: '100%', background: '#f1f5f9', color: '#475569', marginTop: '10px' }}>
          ← Geri
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</p>
      <p style={{ fontSize: '11px', color: '#64748b' }}>{label}</p>
    </div>
  );
}