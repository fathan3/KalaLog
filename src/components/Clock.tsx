"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="h-24 animate-pulse bg-white/5 rounded-lg w-48"></div>;

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-7xl font-bold tracking-tighter text-zinc-100">
        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}
      </h2>
      <p className="text-xl font-medium text-zinc-500 tracking-wide uppercase">
        {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
    </div>
  );
}
