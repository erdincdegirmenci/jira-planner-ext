interface Props {
  current: number;
  total: number;
}

export function ProgressPage({ current, total }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚙️</div>
      <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
        Güncelleniyor...
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
        {current} / {total} issue güncellendi
      </p>
      <div style={{ background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', height: '10px', marginBottom: '8px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }} />
      </div>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6' }}>{pct}%</p>
    </div>
  );
}