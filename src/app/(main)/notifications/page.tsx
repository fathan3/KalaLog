import { getNotifications, markNotificationsAsRead } from "@/actions/notification.actions";
import { auth } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/utils";
import { BellIcon, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { notifications } = await getNotifications();
  
  // Mark as read in background
  if (notifications && notifications.some(n => !n.read)) {
    markNotificationsAsRead();
  }

  return (
    <main className="max-w-2xl mx-auto w-full h-full p-4 md:p-8 mt-4 md:mt-8">
      <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-8 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Garis Waktu
      </Link>

      <div className="mb-12 flex items-center gap-3">
        <BellIcon className="w-8 h-8 text-sky-400" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Notifikasi</h1>
      </div>

      <section className="relative pt-4">
        {(!notifications || notifications.length === 0) ? (
          <div className="py-12 text-center text-zinc-500 text-sm border-t border-white/5 pt-8">
            Belum ada notifikasi.
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {notifications.map((notif: any) => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-xl border flex gap-4 transition-colors ${notif.read ? 'bg-white/[0.01] border-white/5' : 'bg-sky-500/[0.02] border-sky-500/20'}`}
              >
                <div className="mt-1">
                  {notif.type === "LIKE" && <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
                  {notif.type === "REPLY" && <MessageCircle className="w-5 h-5 text-sky-500 fill-sky-500" />}
                  {notif.type === "MENTION" && <User className="w-5 h-5 text-emerald-500" />}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-sm">
                    <span className="font-bold text-white">{notif.sender.name || notif.sender.username}</span>
                    <span className="text-zinc-400">
                      {notif.type === "LIKE" && " menyukai catatan Anda."}
                      {notif.type === "REPLY" && " membalas catatan Anda."}
                      {notif.type === "MENTION" && " menyebut Anda."}
                    </span>
                  </div>
                  {notif.post && (
                    <Link href={`/thread/${notif.postId}`} className="text-zinc-500 text-sm italic truncate hover:text-sky-400">
                      "{notif.post.content.substring(0, 50)}{notif.post.content.length > 50 ? '...' : ''}"
                    </Link>
                  )}
                  <div className="text-xs text-zinc-600 mt-2">
                    {formatRelativeTime(notif.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
