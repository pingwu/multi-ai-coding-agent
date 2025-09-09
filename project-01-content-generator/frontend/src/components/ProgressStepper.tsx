import React, { useState, useEffect } from 'react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedDuration: number; // in seconds
}

interface ProgressStepperProps {
  steps: ProgressStep[];
  currentStep: number;
  isConnected: boolean;
  hasRealData: boolean;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ 
  steps, 
  currentStep, 
  isConnected, 
  hasRealData 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = steps.slice(currentStep);
    const totalEstimated = remainingSteps.reduce((sum, step) => sum + step.estimatedDuration, 0);
    const minutes = Math.floor(totalEstimated / 60);
    const seconds = totalEstimated % 60;
    
    if (minutes > 0) {
      return `~${minutes}m ${seconds}s remaining`;
    }
    return `~${seconds}s remaining`;
  };

  return (
    <div className="progress-stepper">
      <div className="progress-header">
        <div className="progress-title">
          <h3>🔄 Content Generation in Progress</h3>
          <div className="progress-info">
            <span className="connection-status">
              {isConnected ? (
                hasRealData ? '🟢 Live Updates' : '🟡 Connected'
              ) : (
                '🔄 Connecting...'
              )}
            </span>
            <span className="time-info">
              {elapsedTime > 0 && `⏱️ ${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`}
              {currentStep < steps.length && (
                <span className="estimated">• {getEstimatedTimeRemaining()}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div key={step.id} className={`step ${status}`}>
              <div className="step-indicator">
                <div className="step-icon">
                  {status === 'completed' ? '✅' : 
                   status === 'active' ? (
                     <div className="spinner">{step.icon}</div>
                   ) : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${index < currentStep ? 'completed' : ''}`} />
                )}
              </div>
              
              <div className="step-content">
                <div className="step-title">
                  {step.title}
                  {status === 'active' && (
                    <div className="pulse-dot" />
                  )}
                </div>
                <div className="step-description">
                  {step.description}
                </div>
                {status === 'active' && (
                  <div className="step-progress-bar">
                    <div className="progress-fill" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasRealData && isConnected && (
        <div className="waiting-notice">
          <p>💡 Connecting to AI agents... Real-time updates will appear shortly.</p>
        </div>
      )}
    </div>
  );
};

export default ProgressStepper;