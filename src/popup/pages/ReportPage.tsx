import { ExecutionReport } from '../../types';

interface Props {
  report: ExecutionReport;
  onReset: () => void;
}

export function ReportPage({ report, onReset }: Props) {
  const successRate = Math.round((report.updated / report.total) * 100);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
        📊 Sonuç Raporu
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <StatCard label="Toplam" value={report.total} color="#3b82f6" />
        <StatCard label="Güncellendi" value={report.updated} color="#16a34a" />
        <StatCard label="Başarısız" value={report.failed} color="#dc2626" />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
          <span>Başarı oranı</span>
          <span>{successRate}%</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', height: '8px' }}>
          <div style={{ width: `${successRate}%`, height: '100%', background: '#16a34a' }} />
        </div>
      </div>

      {report.failed > 0 && (
        <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <p style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#dc2626', borderBottom: '1px solid #fecaca' }}>
            Başarısız güncellemeler:
          </p>
          {report.results.filter((r) => !r.success).map((r, i) => (
            <div key={i} style={{ padding: '7px 12px', borderBottom: '1px solid #fef2f2', fontSize: '12px' }}>
              <strong>{r.issueKey}</strong>
              <span style={{ color: '#64748b' }}> — {r.error}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onReset} style={{ width: '100%', background: '#3b82f6', color: '#fff', padding: '10px' }}>
        🔄 Yeni Yükleme Yap
      </button>
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