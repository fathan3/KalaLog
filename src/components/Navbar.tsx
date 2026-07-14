import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto max-w-2xl px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            KalaLog.
          </span>
        </Link>
          <Link href="/search">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
            </Button>
          </Link>
      </div>
    </header>
  );
}
