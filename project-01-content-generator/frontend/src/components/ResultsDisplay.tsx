import React, { useState, useEffect } from 'react';
import { JobStatus } from '../App';
import { useParams, useHistory } from 'react-router-dom'; // Added useParams, useHistory
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultsDisplayProps {
  onBack: () => void;
  onGenerateNew: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ onBack, onGenerateNew }) => {
  const { jobId } = useParams<{ jobId: string }>(); // Get jobId from URL
  const history = useHistory(); // Get history for navigation

  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null); // Internal jobStatus state

  useEffect(() => {
    const fetchResultAndStatus = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch job status first
        const statusResponse = await fetch(`/api/status/${jobId}`);
        const fetchedStatus: JobStatus = await statusResponse.json();
        setJobStatus(fetchedStatus);

        if (fetchedStatus.status !== 'completed') {
          // If not completed, maybe show a message or redirect
          // For now, just set loading to false and return
          setLoading(false);
          return;
        }

        // Fetch result if status is completed
        const resultResponse = await fetch(`/api/result/${jobId}`);
        const data = await resultResponse.json();
        setResult(data.result || fetchedStatus.result || 'No content found.');
      } catch (error) {
        console.error('Error fetching result or status:', error);
        setResult(jobStatus?.result || 'Error loading result'); // Use existing jobStatus if available
      } finally {
        setLoading(false);
      }
    };

    fetchResultAndStatus();
  }, [jobId]); // Depend on jobId

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${jobId.slice(0, 8)}.md`; // Use jobId directly
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareToSocial = (platform: string) => {
    const text = result.slice(0, 280); // Truncate for social media
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const formatDuration = () => {
    if (!jobStatus?.started_at || !jobStatus?.completed_at) return 'Unknown'; // Use optional chaining
    
    const start = new Date(jobStatus.started_at).getTime();
    const end = new Date(jobStatus.completed_at).getTime();
    const duration = Math.round((end - start) / 1000);
    
    if (duration < 60) {
      return `${duration} seconds`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m ${seconds}s`;
    }
  };

  if (loading) {
    return (
      <div className="results-display loading">
        <div className="loading-content">
          <h2>📄 Loading Results...</h2>
          <div className="spinner">🔄</div>
        </div>
      </div>
    );
  }

  if (!jobStatus || jobStatus.status === 'error') {
    return (
      <div className="results-display error">
        <h2>❌ Error Loading Results</h2>
        <p>{jobStatus?.error || 'Could not load job status or result.'}</p>
        <button onClick={onBack} className="button secondary">
          ← Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="results-display">
      <div className="results-header">
        <div className="results-title">
          <h2>📄 Generated Content</h2>
          <div className="generation-info">
            <div className="info-item">
              <strong>Status:</strong> 
              <span className={`status ${jobStatus.status}`}>✅ {jobStatus.status}</span>
            </div>
            <div className="info-item">
              <strong>Duration:</strong> {formatDuration()}
            </div>
            <div className="info-item">
              <strong>Completed:</strong> {new Date(jobStatus.completed_at!).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="results-actions">
          <button onClick={() => history.push(`/console/${jobId}`)} className="button secondary"> {/* Updated navigation */}
            🖥️ View Console
          </button>
          <button onClick={onGenerateNew} className="button">
            ✨ Generate New
          </button>
        </div>
      </div>

      <div className="results-body">
        <div className="content-actions">
          <button 
            onClick={copyToClipboard} 
            className={`button secondary ${copySuccess ? 'success' : ''}`}
          >
            {copySuccess ? '✅ Copied!' : '📋 Copy to Clipboard'}
          </button>
          
          <button onClick={downloadAsMarkdown} className="button secondary">
            💾 Download Markdown
          </button>
          
          <div className="share-buttons">
            <span>Share:</span>
            <button onClick={() => shareToSocial('twitter')} className="button social twitter">
              🐦 Twitter
            </button>
            <button onClick={() => shareToSocial('linkedin')} className="button social linkedin">
              💼 LinkedIn
            </button>
            <button onClick={() => shareToSocial('facebook')} className="button social facebook">
              📘 Facebook
            </button>
          </div>
        </div>

        <div className="content-container split-layout">
          <div className="content-panel html-panel">
            <div className="panel-header">
              <h3>📄 HTML Rendered Report</h3>
              <div className="panel-actions">
                <button 
                  onClick={() => window.open(`/reports/${jobId}`, '_blank')}
                  className="button secondary small"
                >
                  🔗 Full Screen
                </button>
              </div>
            </div>
            <div className="content-display html-content">
              {/* Security: keep markdown sanitized by avoiding raw HTML rendering */}
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="md-h1" {...props} />,
                  h2: ({node, ...props}) => <h2 className="md-h2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="md-h3" {...props} />,
                  h4: ({node, ...props}) => <h4 className="md-h4" {...props} />,
                  p: ({node, ...props}) => <p className="md-p" {...props} />,
                  ul: ({node, ...props}) => <ul className="md-ul" {...props} />,
                  ol: ({node, ...props}) => <ol className="md-ol" {...props} />,
                  li: ({node, ...props}) => <li className="md-li" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="md-blockquote" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? 
                      <code className="md-code-inline" {...props} /> : 
                      <pre><code className="md-code-block" {...props} /></pre>,
                  a: ({node, ...props}) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
                  strong: ({node, ...props}) => <strong className="md-strong" {...props} />,
                  em: ({node, ...props}) => <em className="md-em" {...props} />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>

          <div className="content-panel raw-panel">
            <div className="panel-header">
              <h3>📝 Raw Markdown Source</h3>
              <div className="panel-actions">
                <button 
                  onClick={copyToClipboard}
                  className={`button secondary small ${copySuccess ? 'success' : ''}`}
                >
                  {copySuccess ? '✅ Copied!' : '📋 Copy'}
                </button>
                <button 
                  onClick={downloadAsMarkdown}
                  className="button secondary small"
                >
                  💾 Download
                </button>
              </div>
            </div>
            <div className="content-display raw-content">
              <pre className="markdown-source">
                <code>{result}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="results-footer">
        <div className="progress-info">
          {jobStatus && (
            <>
              <div>Job ID: <code>{jobId}</code></div>
              {jobStatus.started_at && (
                <div>Started: {new Date(jobStatus.started_at).toLocaleTimeString()}</div>
              )}
              {jobStatus.completed_at && (
                <div>Completed: {new Date(jobStatus.completed_at).toLocaleTimeString()}</div>
              )}
            </>
          )}
        </div>
        {/* New: Link to full report */}
        <div className="full-report-link">
          <a href={`/reports/${jobId}`} className="button primary">
            📄 View Full Report
          </a>
        </div>
        
        <div className="agent-info">
          <p>📊 Generated by 3 specialized AI agents:</p>
          <div className="agent-list">
            <span className="agent">🔍 Research Agent</span>
            <span className="agent">🎯 Strategy Agent</span>
            <span className="agent">📝 Writer Agent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
