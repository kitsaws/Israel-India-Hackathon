import { useState, useEffect } from 'react';

const useClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = currentTime.toLocaleDateString('en-US', dateOptions);
  const time = currentTime.toLocaleTimeString('en-US');

  return { date, time };
};

export default useClock;
