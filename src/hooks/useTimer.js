import { useState, useEffect, useCallback } from 'react';
import { timeLogsAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing timer state
 * Fetches active timer on mount and provides live elapsed time
 */
export const useTimer = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch active timer on mount
  const fetchActiveTimer = useCallback(async () => {
    try {
      const response = await timeLogsAPI.getActiveTimer();
      const timer = response.data.data.timeLog;
      setActiveTimer(timer);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active timer:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveTimer();
  }, [fetchActiveTimer]);

  // Update elapsed time every second if timer is active
  useEffect(() => {
    if (!activeTimer) {
      setElapsedSeconds(0);
      return;
    }

    // Calculate initial elapsed time
    const startTime = new Date(activeTimer.startedAt).getTime();
    const calculateElapsed = () => {
      const now = Date.now();
      return Math.floor((now - startTime) / 1000);
    };

    setElapsedSeconds(calculateElapsed());

    // Update every second
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Start timer for a task
  const startTimer = async (taskId) => {
    try {
      const response = await timeLogsAPI.startTimer(taskId);
      const newTimer = response.data.data.timeLog;
      setActiveTimer({
        ...newTimer,
        taskId: taskId,
      });
      toast.success('Timer started!');
      return { success: true, timer: newTimer };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to start timer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Stop active timer
  const stopTimer = async () => {
    if (!activeTimer) return { success: false, error: 'No active timer' };

    try {
      const response = await timeLogsAPI.stopTimer(activeTimer.id);
      const stoppedTimer = response.data.data.timeLog;
      setActiveTimer(null);
      setElapsedSeconds(0);
      toast.success(`Timer stopped! Duration: ${formatDuration(stoppedTimer.durationSeconds)}`);
      return { success: true, timer: stoppedTimer };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to stop timer';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Refresh active timer state
  const refreshTimer = async () => {
    await fetchActiveTimer();
  };

  return {
    activeTimer,
    elapsedSeconds,
    loading,
    startTimer,
    stopTimer,
    refreshTimer,
  };
};

// Helper to format duration
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 && hours === 0) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(' ') : '0s';
};
