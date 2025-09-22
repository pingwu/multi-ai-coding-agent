import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const WelcomePage: React.FC = () => {
  const { isAuthenticated, user, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  const handleGoToTasks = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Welcome to Project 04 OAuth Debug</h1>
        {user ? (
          <div className="space-y-2 text-left bg-slate-50 rounded-lg p-4">
            <p className="text-slate-700"><span className="font-medium">Name:</span> {user.name}</p>
            <p className="text-slate-700"><span className="font-medium">Email:</span> {user.email}</p>
            <p className="text-slate-700"><span className="font-medium">User ID:</span> {user.id}</p>
          </div>
        ) : (
          <div className="text-slate-600">
            <p>Fetching your profile details...</p>
          </div>
        )}
        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={() => checkAuth()}
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition"
          >
            Refresh Profile
          </button>
          <button
            onClick={handleGoToTasks}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
          >
            Go to Task Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
