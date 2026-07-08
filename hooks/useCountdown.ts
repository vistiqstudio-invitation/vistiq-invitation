"use client";

import { useEffect, useState } from "react";

export type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const ZERO: CountdownValue = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };

export function useCountdown(targetDate: string | null | undefined) {
  const [value, setValue] = useState<CountdownValue>(ZERO);

  useEffect(() => {
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const tick = () => {
      const distance = target - Date.now();

      if (distance <= 0) {
        setValue({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setValue({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
        isPast: false,
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return value;
}
