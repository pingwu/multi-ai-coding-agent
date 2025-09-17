// Component to show configuration status and setup instructions

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ConfigInfo {
  google_sheets_configured: boolean;
  credentials_configured: boolean;
  openai_configured: boolean;
  sheet_id: string;
  timestamp: string;
}

const ConfigStatus: React.FC = () => {
  const [config, setConfig] = useState<ConfigInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getConfig();
      setConfig(data);
      
      // Auto-show details if there are configuration issues
      const hasIssues = !data.google_sheets_configured || !data.credentials_configured || !data.openai_configured;
      setShowDetails(hasIssues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner" />
          Checking configuration...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
        <h3 className="text-error">⚠️ Configuration Check Failed</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadConfig}>
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!config) return null;

  const allConfigured = config.google_sheets_configured && config.credentials_configured && config.openai_configured;

  return (
    <div className={`card ${allConfigured ? '' : 'fade-in'}`} 
         style={{ 
           backgroundColor: allConfigured ? '#f0fdf4' : '#fef3c7', 
           border: `1px solid ${allConfigured ? '#bbf7d0' : '#fcd34d'}` 
         }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={allConfigured ? 'text-success' : 'text-warning'}>
          {allConfigured ? '✅ Configuration Complete' : '⚠️ Setup Required'}
        </h3>
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {allConfigured ? (
        <p>All systems configured and ready for task processing!</p>
      ) : (
        <p>Some configuration is missing. Please complete the setup to start using the task tracker.</p>
      )}

      {showDetails && (
        <div className="mt-4" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <h4>Configuration Status:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Google Sheets ID</span>
              <span className={`badge ${config.google_sheets_configured ? 'badge-success' : 'badge-error'}`}>
                {config.google_sheets_configured ? 'Configured' : 'Missing'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Google Cloud Credentials</span>
              <span className={`badge ${config.credentials_configured ? 'badge-success' : 'badge-error'}`}>
                {config.credentials_configured ? 'Found' : 'Missing'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>OpenAI API Key</span>
              <span className={`badge ${config.openai_configured ? 'badge-success' : 'badge-error'}`}>
                {config.openai_configured ? 'Configured' : 'Missing'}
              </span>
            </div>
          </div>

          {config.google_sheets_configured && (
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Current Sheet ID:</strong></p>
              <code style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}>
                {config.sheet_id}
              </code>
            </div>
          )}

          {!allConfigured && (
            <div>
              <h4>Setup Instructions:</h4>
              <ol style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
                {!config.google_sheets_configured && (
                  <li><strong>Google Sheets ID:</strong> Add <code>GOOGLE_SHEETS_ID</code> to your .env file</li>
                )}
                {!config.credentials_configured && (
                  <li><strong>Service Account:</strong> Place <code>gcp-service-account.json</code> in the <code>credentials/</code> folder</li>
                )}
                {!config.openai_configured && (
                  <li><strong>OpenAI API:</strong> Add <code>OPENAI_API_KEY</code> to your .env file</li>
                )}
              </ol>
              
              <div className="mt-3">
                <p><strong>Quick Setup:</strong></p>
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}>
                  <div># 1. Copy environment template</div>
                  <div>cp .env.example .env</div>
                  <div></div>
                  <div># 2. Edit .env file with your values</div>
                  <div># 3. Place Google service account JSON in credentials/</div>
                  <div># 4. Restart containers: make down && make up</div>
                </div>
              </div>
              
              <div className="mt-3">
                <p>
                  <strong>Need help?</strong> Run <code>make sheets-setup</code> for detailed Google Sheets setup instructions.
                </p>
              </div>
            </div>
          )}

          <div className="text-muted mt-3" style={{ fontSize: '0.8rem' }}>
            Last checked: {new Date(config.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigStatus;