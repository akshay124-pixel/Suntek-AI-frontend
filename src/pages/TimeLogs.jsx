import { useState, useEffect } from 'react';
import { timeLogsAPI } from '../services/api';
import { formatDateTime, formatDuration } from '../utils/formatters';
import './TimeLogs.css';

const TimeLogs = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeLogs();
  }, []);

  const fetchTimeLogs = async () => {
    try {
      const response = await timeLogsAPI.getTimeLogs();
      setTimeLogs(response.data.data.timeLogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching time logs:', error);
      setLoading(false);
    }
  };

  // Calculate total time
  const totalSeconds = timeLogs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading time logs...</p>
      </div>
    );
  }

  return (
    <div className="timelogs-page">
      <div className="timelogs-header">
        <h1 className="page-title">Time Logs</h1>
        <div className="total-time-badge">
          <span className="total-label">Total Time:</span>
          <span className="total-value">{formatDuration(totalSeconds)}</span>
        </div>
      </div>

      {timeLogs.length > 0 ? (
        <div className="card">
          <div className="timelogs-table">
            <div className="table-header">
              <div className="table-cell">Task</div>
              <div className="table-cell">Started</div>
              <div className="table-cell">Stopped</div>
              <div className="table-cell table-cell-right">Duration</div>
            </div>
            {timeLogs.map((log) => (
              <div key={log.id} className="table-row">
                <div className="table-cell">
                  <div className="task-info-cell">
                    <span className="task-title-cell">{log.taskTitle}</span>
                    <span className={`badge badge-${getStatusBadge(log.taskStatus)}`}>
                      {log.taskStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="table-cell">
                  <span className="time-value">{formatDateTime(log.startedAt)}</span>
                </div>
                <div className="table-cell">
                  <span className="time-value">{formatDateTime(log.stoppedAt)}</span>
                </div>
                <div className="table-cell table-cell-right">
                  <span className="duration-value">
                    {formatDuration(log.durationSeconds)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No time logs yet</p>
          <p className="text-muted">
            Start and stop timers on your tasks to see them here
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function
const getStatusBadge = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'primary';
    default:
      return 'secondary';
  }
};

export default TimeLogs;
