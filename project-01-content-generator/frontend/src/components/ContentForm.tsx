import React, { useState } from 'react';
import { ContentRequest } from '../App';

interface ContentFormProps {
  onStartGeneration: (request: ContentRequest) => void;
}

const DEFAULT_AGENTS = {
  researcher: {
    role: "Content Research Expert",
    goal: "Gather comprehensive information on {topic} including key insights, statistics, and current trends",
    backstory: "You're a seasoned digital researcher with expertise in finding credible sources and data. You excel at identifying the most relevant and up-to-date information about any topic, ensuring accuracy and comprehensiveness in your research."
  },
  strategist: {
    role: "Content Strategy and Planning Expert", 
    goal: "Create strategic framework and structure for compelling content about {topic}",
    backstory: "You're a marketing strategist who understands audience engagement and content structure. You're known for creating content strategies that resonate with target audiences and drive meaningful engagement through well-planned messaging and organization."
  },
  writer: {
    role: "Professional Content Creator",
    goal: "Generate high-quality, engaging written content about {topic} based on research and strategy", 
    backstory: "You're an experienced writer who creates compelling content across multiple formats. You have a talent for transforming research and strategy into engaging, readable content that captures attention and delivers value to readers."
  }
};

const DEFAULT_TASKS = {
  research: "Conduct comprehensive research about {topic}. Find the most current and relevant information including key statistics, recent trends, expert opinions, and real-world examples. Make sure your research is accurate and from credible sources.",
  strategy: "Based on the research findings, develop a comprehensive content strategy for {topic}. Create a strategic framework that includes target audience identification, key messaging, content structure, and engagement tactics.",
  writing: "Create high-quality, engaging content about {topic} using the research findings and strategic framework. The content should be well-structured, engaging, professional yet accessible, with compelling headlines and clear sections."
};

const ContentForm: React.FC<ContentFormProps> = ({ onStartGeneration }) => {
  const [topic, setTopic] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    
    const request: ContentRequest = {
      topic: topic.trim(),
      agents: agents,
      tasks: tasks
    };

    try {
      // Make the API call directly to get job_id
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const result = await response.json();
      setSubmittedJobId(result.job_id);
      // Don't call onStartGeneration since we already made the API call
    } catch (error) {
      console.error('Error starting generation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAgent = (agentKey: keyof typeof agents, field: keyof typeof agents.researcher, value: string) => {
    setAgents(prev => ({
      ...prev,
      [agentKey]: {
        ...prev[agentKey],
        [field]: value
      }
    }));
  };

  const updateTask = (taskKey: keyof typeof tasks, value: string) => {
    setTasks(prev => ({
      ...prev,
      [taskKey]: value
    }));
  };

  return (
    <div className="content-form">
      <h2>✨ Generate Content with AI Agents</h2>
      <p>Enter a topic and let our 3-agent team create compelling content for you!</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">
            💡 Content Topic <span style={{color: '#e53e3e'}}>*</span>
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'AI in Healthcare 2026', 'Remote Work Best Practices', 'Sustainable Energy Solutions'"
            required
          />
        </div>

        <div className="form-group">
          <button
            type="button"
            className="button secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '🔼 Hide Advanced Settings' : '🔽 Show Advanced Settings'}
          </button>
        </div>

        {showAdvanced && (
          <div className="advanced-settings">
            <h3>🤖 Agent Configuration</h3>
            
            {/* Research Agent */}
            <div className="agent-section">
              <h4>🔍 Research Agent</h4>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={agents.researcher.role}
                  onChange={(e) => updateAgent('researcher', 'role', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Goal</label>
                <textarea
                  value={agents.researcher.goal}
                  onChange={(e) => updateAgent('researcher', 'goal', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Backstory</label>
                <textarea
                  value={agents.researcher.backstory}
                  onChange={(e) => updateAgent('researcher', 'backstory', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Strategy Agent */}
            <div className="agent-section">
              <h4>🎯 Strategy Agent</h4>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={agents.strategist.role}
                  onChange={(e) => updateAgent('strategist', 'role', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Goal</label>
                <textarea
                  value={agents.strategist.goal}
                  onChange={(e) => updateAgent('strategist', 'goal', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Backstory</label>
                <textarea
                  value={agents.strategist.backstory}
                  onChange={(e) => updateAgent('strategist', 'backstory', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Writer Agent */}
            <div className="agent-section">
              <h4>📝 Writer Agent</h4>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={agents.writer.role}
                  onChange={(e) => updateAgent('writer', 'role', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Goal</label>
                <textarea
                  value={agents.writer.goal}
                  onChange={(e) => updateAgent('writer', 'goal', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Backstory</label>
                <textarea
                  value={agents.writer.backstory}
                  onChange={(e) => updateAgent('writer', 'backstory', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <h3>📋 Task Configuration</h3>
            
            <div className="form-group">
              <label>🔍 Research Task</label>
              <textarea
                value={tasks.research}
                onChange={(e) => updateTask('research', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>🎯 Strategy Task</label>
              <textarea
                value={tasks.strategy}
                onChange={(e) => updateTask('strategy', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>📝 Writing Task</label>
              <textarea
                value={tasks.writing}
                onChange={(e) => updateTask('writing', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <button 
            type="submit" 
            className="button"
            disabled={!topic.trim() || isLoading}
          >
            {isLoading ? '🔄 Starting Generation...' : '🚀 Generate Content'}
          </button>
        </div>
      </form>

      {submittedJobId && (
        <div className="job-submitted">
          <h3>🚀 Content Generation Started!</h3>
          <p>Your job has been submitted successfully.</p>
          <div className="progress-links">
            <a 
              href={`/console/${submittedJobId}`} 
              className="button" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🖥️ View Live Progress
            </a>
            <a 
              href={`/api/status/${submittedJobId}`} 
              className="button secondary" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              📊 Check Status API
            </a>
          </div>
          <div className="job-info">
            <p><strong>Job ID:</strong> <code>{submittedJobId}</code></p>
            <p><em>Bookmark this page or save the Job ID to check progress later!</em></p>
          </div>
          <button 
            onClick={() => setSubmittedJobId(null)} 
            className="button secondary small"
          >
            ✨ Create Another
          </button>
        </div>
      )}

      <div className="examples">
        <h3>💡 Example Topics to Try:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
          {[
            "Artificial Intelligence in Education",
            "Future of Remote Work",
            "Sustainable Technology Trends",
            "Digital Marketing Strategies 2026",
            "Cybersecurity for Small Business",
            "Health Tech Innovations"
          ].map((example, index) => (
            <div
              key={index}
              className="example"
              onClick={() => setTopic(example)}
              style={{
                background: '#f7fafc',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {example}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentForm;