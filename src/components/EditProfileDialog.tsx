"use client"

import { useState, useTransition } from "react"
import { updateProfile } from "@/actions/profile.actions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export default function EditProfileDialog({
  user
}: {
  user: { name: string | null; username: string | null }
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name || "")
  const [username, setUsername] = useState(user.username || "")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    setError("")
    startTransition(async () => {
      const res = await updateProfile({ name, username })
      if (res.error) {
        setError(res.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-6 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all text-zinc-300">
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Profil</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Ubah nama tampilan dan username unik Anda di sini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">Nama Tampilan</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-white/5 border-white/10 text-white focus-visible:ring-zinc-600"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-zinc-300">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500">@</span>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
                className="pl-8 bg-white/5 border-white/10 text-white focus-visible:ring-zinc-600"
              />
            </div>
            <p className="text-[11px] text-zinc-500">Hanya huruf kecil, angka, dan garis bawah (_).</p>
          </div>
          
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={isPending || !name.trim() || !username.trim()}
            className="bg-zinc-100 text-zinc-900 hover:bg-white w-full sm:w-auto"
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
