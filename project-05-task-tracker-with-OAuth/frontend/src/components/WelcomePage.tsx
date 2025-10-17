import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const WelcomePage: React.FC = () => {
  const { isAuthenticated, user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'celebration' | 'sheets-setup'>('celebration');
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [extractedSheetId, setExtractedSheetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  // Extract Sheet ID from URL or use raw ID
  const handleSheetsUrlChange = (value: string) => {
    setSheetsUrl(value);
    setError('');

    // Pattern: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit...
    const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      setExtractedSheetId(match[1]);
    } else if (value.length > 20 && !value.includes('/')) {
      // Assume it's just the sheet ID
      setExtractedSheetId(value);
    } else {
      setExtractedSheetId('');
    }
  };

  const handleSaveSheetId = async () => {
    if (!extractedSheetId) {
      setError('Please enter a valid Google Sheets URL or Sheet ID');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/config/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sheet_id: extractedSheetId }),
      });

      if (response.ok) {
        setSetupComplete(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save Google Sheets configuration');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipSetup = () => {
    navigate('/');
  };

  if (step === 'celebration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-400">
          {/* Celebration Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">Congratulations!</h1>
            <h2 className="text-2xl font-semibold text-gray-700">OAuth Authentication Successful!</h2>
          </div>

          {/* Achievement Summary */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span> What You've Accomplished:
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 mt-1">✓</span>
                <span><strong>Docker Multi-Service Architecture:</strong> Successfully running 3 containerized services (crew-service, api-service, frontend)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 mt-1">✓</span>
                <span><strong>Google OAuth 2.0 Integration:</strong> Secure authentication with JWT session management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 mt-1">✓</span>
                <span><strong>Environment Configuration:</strong> Dynamic .env loading without image rebuilds</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3 mt-1">✓</span>
                <span><strong>Production-Ready Security:</strong> PKCE flow, state validation, and secure cookies</span>
              </li>
            </ul>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">Authenticated User:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p className="text-xs text-blue-600">User ID: {user.id}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-yellow-50 rounded-lg p-5 mb-6 border-l-4 border-yellow-500">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
              <span className="text-xl mr-2">📋</span> Next Step: Google Sheets Setup
            </h4>
            <p className="text-sm text-yellow-800">
              Configure your Google Sheets to store and manage tasks with AI-powered processing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setStep('sheets-setup')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue to Google Sheets Setup →
            </button>
            <button
              onClick={handleSkipSetup}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Google Sheets Setup Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {setupComplete ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Setup Complete!</h2>
            <p className="text-gray-600 mb-4">Redirecting to Task Dashboard...</p>
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Google Sheets Configuration</h2>
              <p className="text-gray-600">Connect your Google Sheet to store and manage tasks</p>
            </div>

            {/* Step 1: Create/Get Google Sheet */}
            <div className="bg-blue-50 rounded-lg p-5 mb-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                Create or Open Your Google Sheet
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 ml-8 list-decimal">
                <li>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Google Sheets</a></li>
                <li>Create a new spreadsheet or open an existing one</li>
                <li>Copy the entire URL from your browser (e.g., https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit)</li>
              </ol>
            </div>

            {/* Step 2: Service Account Setup */}
            <div className="bg-purple-50 rounded-lg p-5 mb-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                Configure GCP Service Account Access
              </h3>
              <div className="text-sm text-purple-800 space-y-2 ml-8">
                <p><strong>Important:</strong> Your Google Sheet must be shared with the service account.</p>
                <ol className="list-decimal space-y-2 mt-2">
                  <li>Locate your service account email in <code className="bg-purple-200 px-2 py-1 rounded">credentials/gcp-service-account.json</code></li>
                  <li>Look for the <code className="bg-purple-200 px-2 py-1 rounded">"client_email"</code> field (e.g., task-tracker@project.iam.gserviceaccount.com)</li>
                  <li>In your Google Sheet, click <strong>Share</strong> button (top-right)</li>
                  <li>Paste the service account email and grant <strong>Editor</strong> permissions</li>
                  <li>Click <strong>Send</strong> (uncheck "Notify people" if you don't want emails)</li>
                </ol>
              </div>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Sheets URL or Sheet ID:
              </label>
              <input
                type="text"
                value={sheetsUrl}
                onChange={(e) => handleSheetsUrlChange(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit or just YOUR_SHEET_ID"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              {extractedSheetId && (
                <div className="mt-2 text-sm bg-green-50 text-green-700 p-3 rounded border border-green-200">
                  ✓ Sheet ID extracted: <code className="font-mono bg-green-100 px-2 py-1 rounded">{extractedSheetId}</code>
                </div>
              )}
              {error && (
                <div className="mt-2 text-sm bg-red-50 text-red-700 p-3 rounded border border-red-200">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveSheetId}
                disabled={!extractedSheetId || isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  extractedSheetId && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue to Dashboard'}
              </button>
              <button
                onClick={handleSkipSetup}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Skip for Now
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 Tip: You can update this configuration later in the Settings</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
