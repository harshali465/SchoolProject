import { useState, useEffect } from "react";

export default function useCountdown() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  const hoursLeft = 23 - time.getHours();
  const minutesLeft = 59 - time.getMinutes();
  const secondsLeft = 59 - time.getSeconds();

  return { hoursLeft, minutesLeft, secondsLeft };
}
