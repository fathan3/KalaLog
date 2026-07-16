"use client";

import { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "@/actions/notification.actions";
import Link from "next/link";
import { Button } from "./ui/button";

export default function NotificationBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Poll for new notifications every 30 seconds
    const interval = setInterval(async () => {
      try {
        const newCount = await getUnreadNotificationCount();
        setCount(newCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/10 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
        )}
      </Button>
    </Link>
  );
}
