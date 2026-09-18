import { formatDuration } from '../../utils/formatters';
import './Timer.css';

const Timer = ({ activeTimer, elapsedSeconds, onStop, loading }) => {
  if (loading) {
    return (
      <div className="timer-widget">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!activeTimer) {
    return (
      <div className="timer-widget timer-inactive">
        <div className="timer-icon">⏱️</div>
        <div className="timer-info">
          <p className="timer-status">No active timer</p>
          <p className="text-muted">Start tracking time on a task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timer-widget timer-active">
      <div className="timer-pulse">⏱️</div>
      <div className="timer-info">
        <p className="timer-task">{activeTimer.taskTitle}</p>
        <p className="timer-duration">{formatDuration(elapsedSeconds)}</p>
      </div>
      <button onClick={onStop} className="btn btn-danger btn-sm">
        Stop
      </button>
    </div>
  );
};

export default Timer;
