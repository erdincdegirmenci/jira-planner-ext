import { ParseResult } from '../../types';

interface Props {
  result: ParseResult;
  onValidate: () => void;
  onBack: () => void;
}

export function PreviewPage({ result, onValidate, onBack }: Props) {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
        👁️ Önizleme
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <StatCard label="Toplam Satır" value={result.totalRows} color="#3b82f6" />
        <StatCard label="Geçerli" value={result.rows.length} color="#16a34a" />
        <StatCard label="Hatalı" value={result.errors.length} color="#dc2626" />
      </div>

      {result.errors.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', marginBottom: '6px' }}>
            Parse Hataları:
          </p>
          {result.errors.slice(0, 5).map((e, i) => (
            <p key={i} style={{ fontSize: '12px', color: '#dc2626' }}>
              Satır {e.row}: {e.field} — {e.message}
            </p>
          ))}
          {result.errors.length > 5 && (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              +{result.errors.length - 5} daha...
            </p>
          )}
        </div>
      )}

      <div style={{ overflowX: 'auto', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
              {['Issue Key', 'Assignee', 'SP', 'Week'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>{row.issueKey}</td>
                <td style={tdStyle}>{row.assigneeEmail}</td>
                <td style={tdStyle}>{row.storyPoints}</td>
                <td style={tdStyle}>{row.plannedWeekDay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={onBack} style={{ background: '#f1f5f9', color: '#475569', flex: 1 }}>
          ← Geri
        </button>
        <button
          onClick={onValidate}
          disabled={result.rows.length === 0}
          style={{ background: '#3b82f6', color: '#fff', flex: 2 }}
        >
          Doğrula →
        </button>
      </div>
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

const thStyle: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' };
const tdStyle: React.CSSProperties = { padding: '7px 12px', color: '#1e293b' };