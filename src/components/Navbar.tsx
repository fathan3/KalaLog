import Link from "next/link";
import { Button } from "./ui/button";
import { getUnreadNotificationCount } from "@/actions/notification.actions";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const session = await auth();
  let unreadCount = 0;
  if (session?.user) {
    unreadCount = await getUnreadNotificationCount();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto max-w-2xl px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            KalaLog.
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          {session?.user && (
            <Link href="/drafts">
              <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                Drafts
              </Button>
            </Link>
          )}
          <Link href="/search">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
            </Button>
          </Link>
          {session?.user && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/10 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                )}
              </Button>
            </Link>
          )}
          {session?.user && (
            <Link href={`/profile/${session.user.username}`}>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Button>
            </Link>
          )}
          {session?.user && (
            <div className="ml-2 pl-2 border-l border-white/10 flex items-center">
              <LogoutButton iconOnly={true} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
