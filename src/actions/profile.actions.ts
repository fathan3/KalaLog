"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: { name: string; username: string }) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Unauthenticated" }
    }
    
    if (!data.name || !data.name.trim()) {
      return { error: "Nama tidak boleh kosong" }
    }
    if (!data.username || !data.username.trim()) {
      return { error: "Username tidak boleh kosong" }
    }
    
    const cleanUsername = data.username.toLowerCase().replace(/[^a-z0-9_]/g, '')
    
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername }
    })
    
    if (existing && existing.id !== session.user.id) {
      return { error: "Username sudah digunakan oleh orang lain" }
    }
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name.trim(),
        username: cleanUsername
      }
    })
    
    revalidatePath("/", "layout")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { error: "Terjadi kesalahan sistem saat memperbarui profil." }
  }
}
