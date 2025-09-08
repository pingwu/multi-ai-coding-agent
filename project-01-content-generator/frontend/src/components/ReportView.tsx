import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { JobStatus } from '../App'; // Assuming JobStatus interface is in App.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const ReportView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const history = useHistory();
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!jobId) {
        setError('Job ID not provided.');
        setLoading(false);
        return;
      }

      try {
        // Fetch job status first to get metadata
        const statusResponse = await fetch(`/api/status/${jobId}`);
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          setJobStatus(status);
        }

        // Fetch the content
        const response = await fetch(`/api/result/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReportContent(data.result || 'No content found.');
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(`Failed to load report: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [jobId]);

  const formatDuration = () => {
    if (!jobStatus?.started_at || !jobStatus?.completed_at) return 'Unknown';
    const start = new Date(jobStatus.started_at).getTime();
    const end = new Date(jobStatus.completed_at).getTime();
    const duration = Math.round((end - start) / 1000);
    return duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`;
  };

  const printPage = () => {
    window.print();
  };

  const downloadPDF = () => {
    // Simple print to PDF functionality
    window.print();
  };

  if (loading) {
    return (
      <div className="report-view loading-state">
        <div className="loading-container">
          <h2>📄 Loading Full Report...</h2>
          <div className="spinner">🔄</div>
          <p>Preparing your content for viewing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-view error-state">
        <div className="error-container">
          <h2>❌ Error Loading Report</h2>
          <p>{error}</p>
          <button onClick={() => history.goBack()} className="button secondary">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-view full-report">
      {/* Report Header with Actions */}
      <div className="report-header no-print">
        <div className="header-content">
          <div className="report-meta">
            <h1>📄 AI Generated Content Report</h1>
            <div className="meta-details">
              <span className="meta-item">
                <strong>Job ID:</strong> <code>{jobId}</code>
              </span>
              {jobStatus && (
                <>
                  <span className="meta-item">
                    <strong>Generated:</strong> {new Date(jobStatus.completed_at || jobStatus.created_at).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    <strong>Duration:</strong> {formatDuration()}
                  </span>
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${jobStatus.status}`}>
                      {jobStatus.status === 'completed' ? '✅' : '❌'} {jobStatus.status}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="report-actions">
            <button onClick={() => history.push(`/results/${jobId}`)} className="button secondary">
              📊 Results View
            </button>
            <button onClick={() => history.push(`/console/${jobId}`)} className="button secondary">
              🖥️ Console Log
            </button>
            <button onClick={printPage} className="button secondary">
              🖨️ Print/PDF
            </button>
            <button onClick={() => history.push('/')} className="button">
              ✨ Generate New
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="report-content">
        <div className="content-wrapper">
          <div className="generation-info no-print">
            <div className="info-banner">
              <div className="info-text">
                <h3>🤖 Multi-Agent Generated Content</h3>
                <p>This content was created by a team of 3 specialized AI agents working together:</p>
                <div className="agent-list">
                  <span className="agent-badge">🔍 Research Agent</span>
                  <span className="agent-badge">🎯 Strategy Agent</span>
                  <span className="agent-badge">📝 Writing Agent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({node, ...props}) => <h1 className="content-h1" {...props} />,
                h2: ({node, ...props}) => <h2 className="content-h2" {...props} />,
                h3: ({node, ...props}) => <h3 className="content-h3" {...props} />,
                p: ({node, ...props}) => <p className="content-p" {...props} />,
                ul: ({node, ...props}) => <ul className="content-ul" {...props} />,
                ol: ({node, ...props}) => <ol className="content-ol" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="content-blockquote" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? <code className="content-code-inline" {...props} /> : <code className="content-code-block" {...props} />,
                a: ({node, ...props}) => <a className="content-link" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {reportContent || ''}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Report Footer */}
      <footer className="report-footer no-print">
        <div className="footer-content">
          <div className="generation-details">
            <h4>📈 Generation Details</h4>
            {jobStatus && (
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Created:</span>
                  <span className="value">{new Date(jobStatus.created_at).toLocaleString()}</span>
                </div>
                {jobStatus.started_at && (
                  <div className="detail-item">
                    <span className="label">Started:</span>
                    <span className="value">{new Date(jobStatus.started_at).toLocaleString()}</span>
                  </div>
                )}
                {jobStatus.completed_at && (
                  <div className="detail-item">
                    <span className="label">Completed:</span>
                    <span className="value">{new Date(jobStatus.completed_at).toLocaleString()}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Word Count:</span>
                  <span className="value">{reportContent?.split(/\s+/).length || 0} words</span>
                </div>
              </div>
            )}
          </div>

          <div className="powered-by">
            <p>🚀 Powered by CrewAI Multi-Agent Framework</p>
            <p>⚡ Built with FastAPI • TypeScript • React</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportView;