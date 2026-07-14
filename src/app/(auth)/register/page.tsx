import { register } from "@/actions/auth.actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-zinc-500">
            Daftarkan diri Anda ke jurnal waktu
          </p>
        </div>
        
        <div className="grid gap-6">
           <form action={register} className="flex flex-col space-y-4">
             <div className="flex flex-col space-y-2">
               <input 
                 name="name" 
                 type="text" 
                 placeholder="Nama Tampilan" 
                 className="p-3 bg-white/[0.03] border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 text-foreground"
                 required
               />
               <input 
                 name="email" 
                 type="email" 
                 placeholder="name@example.com" 
                 className="p-3 bg-white/[0.03] border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 text-foreground"
                 required
               />
               <input 
                 name="password" 
                 type="password" 
                 placeholder="Kata sandi baru" 
                 className="p-3 bg-white/[0.03] border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 text-foreground"
                 required
               />
             </div>
             <Button type="submit" className="w-full bg-zinc-100 text-zinc-900 py-6 font-bold hover:bg-white transition-colors">
               Daftar Sekarang
             </Button>
           </form>
           
           <p className="text-center text-sm text-zinc-500">
             Sudah punya akun?{" "}
             <Link href="/login" className="text-zinc-300 hover:underline">
               Masuk
             </Link>
           </p>
        </div>
      </div>
    </div>
  )
}
