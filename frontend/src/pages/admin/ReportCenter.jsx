import { useEffect, useState } from 'react';
import { fetchAchievements } from '../../api/boards.js';
import { exportCsvReport, exportExcelReport } from '../../api/admin.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

const ReportCenter = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchAchievements();
        setReportData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const data = format === 'csv' ? await exportCsvReport('all') : await exportExcelReport('all');
      const filename = format === 'csv' ? 'achievement-report.csv' : 'achievement-report.xlsx';
      const mimeType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      downloadFile(data, filename, mimeType);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Report Center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Export goal achievement reports and review team results in one place.</p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Achievement Reports">
          {reportData.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No report data is available.</p>
          ) : (
            <div className="space-y-4">
              {reportData.map((item, index) => (
                <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{item.employee}</div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status: {item.status} • Quarter: {item.quarter}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Export Options">
          <div className="space-y-4">
            <Button type="button" onClick={() => handleExport('csv')} disabled={exporting}>Export CSV</Button>
            <Button type="button" variant="secondary" onClick={() => handleExport('excel')} disabled={exporting}>Export Excel</Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download a complete achievement export for compliance and leadership review.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportCenter;
