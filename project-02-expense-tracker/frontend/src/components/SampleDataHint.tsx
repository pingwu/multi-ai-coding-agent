import React, { useState } from 'react';

interface Props {
  onDismissForever?: () => void;
}

const SampleDataHint: React.FC<Props> = ({ onDismissForever }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sample-data-hint">
      <button className="sample-toggle" onClick={() => setExpanded(e => !e)}>
        {expanded ? 'Hide' : 'Load'} Sample Data
      </button>
      {onDismissForever && (
        <button
          className="sample-toggle dismiss"
          onClick={() => {
            try {
              localStorage.setItem('suppress_sample_hint', '1');
            } catch {}
            onDismissForever();
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Don't show again
        </button>
      )}
      {expanded && (
        <div className="sample-instructions">
          <p>
            To quickly explore the app, you can load sample expenses. Run one of the following in your terminal from the repo root:
          </p>
          <pre>
{`# Replace your current data (overwrites)
cp project-02-expense-tracker/data/expenses_sample.csv project-02-expense-tracker/data/expenses.csv

# Or append sample rows (skip header)
tail -n +2 project-02-expense-tracker/data/expenses_sample.csv >> project-02-expense-tracker/data/expenses.csv

# Refresh this page after updating the file.`}
          </pre>
          <p className="sample-note">
            Note: Containers usually detect file changes automatically. If needed, restart Project 2 containers.
          </p>
        </div>
      )}
    </div>
  );
};

export default SampleDataHint;
