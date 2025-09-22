import React from 'react';

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    // In a real application, this would redirect to the Google OAuth URL
    // For now, it just logs to the console
    console.log('Attempting to log in with Google...');
    window.location.href = 'http://localhost:8000/auth/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Project Analyzer - Team Edition</h1>
        <p className="text-gray-600 mb-6">Please sign in to continue</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
