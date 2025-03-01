import { useState, useEffect } from "react";

export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const useCountdown = (checkOutTime: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!checkOutTime || isNaN(checkOutTime.getTime())) {
      console.warn("Invalid checkOutTime:", checkOutTime);
      return;
    }

    const targetTime = checkOutTime.getTime();

    const updateCountdown = () => {
      const currentTime = Date.now();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => {
      clearInterval(timer);
    };
  }, [checkOutTime]);

  return timeLeft;
};

export default useCountdown;
