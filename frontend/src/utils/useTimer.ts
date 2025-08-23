import { useEffect, useState, useRef } from 'react';

export function useTimer() {
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerStarted = useRef(false);

  useEffect(() => {
    setTimeSeconds(0);
    setTimerRunning(false);
    timerStarted.current = false;
  }, []);

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setTimeSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning]);

  useEffect(() => {
    const startTimer = () => {
      if (!timerStarted.current) {
        setTimerRunning(true);
        timerStarted.current = true;
      }
    };

    document.addEventListener('scroll', startTimer, true);
    document.addEventListener('click', startTimer);

    return () => {
      document.removeEventListener('scroll', startTimer, true);
      document.removeEventListener('click', startTimer);
    };
  }, []);

  const timeFormatted = `${Math.floor(timeSeconds / 60).toString().padStart(2, '0')}:${(timeSeconds % 60).toString().padStart(2, '0')}`;

  return { timeSeconds, timerRunning, timeFormatted };
}
