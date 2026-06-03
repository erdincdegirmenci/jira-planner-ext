import { useRef, useState } from 'react';
import { parseFile } from '../../services/fileParser';
import { ParseResult } from '../../types';
import { FILE_ACCEPT } from '../../constants';

interface Props {
  onParsed: (result: ParseResult) => void;
  onSettings: () => void;
}

export function UploadPage({ onParsed, onSettings }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setError('');
    setLoading(true);
    try {
      const result = await parseFile(file);
      onParsed(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dosya okunamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600 }}>📂 Dosya Yükle</h2>
        <button onClick={onSettings} style={{ background: '#f1f5f9', color: '#475569', fontSize: '12px' }}>
          ⚙️ Ayarlar
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#3b82f6' : '#cbd5e1'}`,
          borderRadius: '10px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? '#eff6ff' : '#f8fafc',
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
        <p style={{ fontWeight: 500, marginBottom: '6px' }}>
          CSV veya XLSX dosyasını sürükle & bırak
        </p>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          veya tıklayarak seç
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={FILE_ACCEPT}
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {loading && (
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#3b82f6' }}>
          Dosya okunuyor...
        </p>
      )}

      {error && (
        <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '24px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>
          Beklenen kolon isimleri:
        </p>
        {['Issue Key', 'Assignee Email', 'Story Points', 'Planned Week Day'].map((col) => (
          <span key={col} style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 8px', background: '#e2e8f0', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}