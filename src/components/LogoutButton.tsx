import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
      className="w-full"
    >
      <Button 
        type="submit"
        variant="ghost" 
        className="w-full text-zinc-500 hover:text-red-400 hover:bg-red-400/10 justify-start py-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        Keluar / Log Out
      </Button>
    </form>
  );
}
