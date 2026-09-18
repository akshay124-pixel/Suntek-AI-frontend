import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useTimer } from '../hooks/useTimer';
import Timer from '../components/timer/Timer';
import { formatDuration } from '../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeTimer, elapsedSeconds, stopTimer, loading: timerLoading } = useTimer();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getTodaySummary();
      setTodaySummary(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  const handleStopTimer = async () => {
    const result = await stopTimer();
    if (result.success) {
      // Refresh dashboard to show updated stats
      fetchDashboard();
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {/* Active Timer */}
      <Timer
        activeTimer={activeTimer}
        elapsedSeconds={elapsedSeconds}
        onStop={handleStopTimer}
        loading={timerLoading}
      />

      {/* Today's Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            ⏱️
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Tracked Today</p>
            <p className="stat-value">
              {formatDuration(todaySummary?.totalTrackedSeconds || 0)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            ✅
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed Tasks</p>
            <p className="stat-value">{todaySummary?.completedTasks || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            🔄
          </div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{todaySummary?.inProgressTasks || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3f4f6' }}>
            📋
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Tasks</p>
            <p className="stat-value">{todaySummary?.pendingTasks || 0}</p>
          </div>
        </div>
      </div>

      {/* Tasks Worked On Today */}
      <div className="card">
        <h2 className="card-title">Tasks Worked On Today</h2>
        {todaySummary?.taskBreakdown?.length > 0 ? (
          <div className="task-breakdown">
            {todaySummary.taskBreakdown.map((task) => (
              <div key={task.taskId} className="breakdown-item">
                <div className="breakdown-info">
                  <span className="breakdown-title">{task.taskTitle}</span>
                  <span className={`badge badge-${getStatusBadge(task.taskStatus)}`}>
                    {task.taskStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="breakdown-time">
                  {formatDuration(task.trackedSeconds)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>No tasks tracked today yet</p>
            <p className="text-muted">Start a timer on a task to see it here</p>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="summary-text">
          {todaySummary?.tasksWorkedOn > 0 ? (
            <p>
              You've worked on <strong>{todaySummary.tasksWorkedOn}</strong> task
              {todaySummary.tasksWorkedOn !== 1 ? 's' : ''} today, tracking a total of{' '}
              <strong>{formatDuration(todaySummary.totalTrackedSeconds)}</strong> of
              productive time. Keep up the great work! 🎉
            </p>
          ) : (
            <p className="text-muted">
              Start tracking your tasks to see your productivity summary here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get badge color
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

export default Dashboard;
