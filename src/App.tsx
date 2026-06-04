import { useState, useEffect } from 'react';
import { AppPage, JiraConfig, ParseResult, ValidationResult, ExecutionReport } from './types';
import { getJiraConfig } from './storage';
import { applyUpdates } from './services/updater';
import { SettingsPage } from './popup/pages/SettingsPage';
import { UploadPage } from './popup/pages/UploadPage';
import { PreviewPage } from './popup/pages/PreviewPage';
import { ValidationPage } from './popup/pages/ValidationPage';
import { ProgressPage } from './popup/pages/ProgressPage';
import { ReportPage } from './popup/pages/ReportPage';

export function App() {
  const [page, setPage] = useState<AppPage>('upload');
  const [config, setConfig] = useState<JiraConfig | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [report, setReport] = useState<ExecutionReport | null>(null);

  useEffect(() => {
    getJiraConfig().then((cfg) => {
      if (cfg) {
        setConfig(cfg);
      } else {
        setPage('settings');
      }
    });
  }, []);

  const handleApplyUpdates = async (results: ValidationResult[]) => {
    if (!config) return;
    setValidationResults(results);
    setProgress({ current: 0, total: results.filter((r) => r.isValid).length });
    setPage('progress');
    const execReport = await applyUpdates(config, results, (current, total) => {
      setProgress({ current, total });
    });
    setReport(execReport);
    setPage('report');
  };

  const handleReset = () => {
    setParseResult(null);
    setValidationResults([]);
    setReport(null);
    setPage('upload');
  };

  if (page === 'settings') {
    return (
      <SettingsPage
        onSaved={() => {
          getJiraConfig().then((cfg) => {
            if (cfg) setConfig(cfg);
            setPage('upload');
          });
        }}
      />
    );
  }

  if (page === 'upload') {
    return (
      <UploadPage
        onParsed={(result) => { setParseResult(result); setPage('preview'); }}
        onSettings={() => setPage('settings')}
      />
    );
  }

	if (page === 'preview' && parseResult) {
	  return (
		<PreviewPage
		  result={parseResult}
		  config={config}
		  onValidate={() => setPage('validation')}
		  onBack={() => setPage('upload')}
		/>
	  );
	}

  if (page === 'validation' && parseResult && config) {
    return (
      <ValidationPage
        rows={parseResult.rows}
        config={config}
        onApply={handleApplyUpdates}
        onBack={() => setPage('preview')}
      />
    );
  }

  if (page === 'progress') {
    return <ProgressPage current={progress.current} total={progress.total} />;
  }

  if (page === 'report' && report) {
    return <ReportPage report={report} onReset={handleReset} />;
  }

  return null;
}