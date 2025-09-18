import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface Step {
  label: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, steps }) => (
  <Row className="progress-stepper g-0 text-center">
    {steps.map((step, index) => (
      <React.Fragment key={step.label}>
        <Col>
          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle border d-flex align-items-center justify-content-center mb-2 ${
                index < currentStep ? 'bg-primary text-white' : index === currentStep ? 'bg-white border-primary' : 'bg-white'
              }`}
              style={{ width: '48px', height: '48px', borderWidth: '3px' }}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <small className="fw-semibold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {step.label}
            </small>
            <small className="text-muted" style={{ maxWidth: '180px' }}>
              {step.description}
            </small>
          </div>
        </Col>
        {index < steps.length - 1 && (
          <Col xs="auto" className="d-flex align-items-center">
            <div
              style={{
                width: '80px',
                height: '3px',
                backgroundColor: index < currentStep ? '#0d6efd' : '#d0d7e2',
              }}
            />
          </Col>
        )}
      </React.Fragment>
    ))}
  </Row>
);

export default ProgressStepper;
