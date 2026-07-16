"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { notifications: [] }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { name: true, username: true, image: true } },
        post: { select: { content: true } }
      }
    })

    return { notifications }
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return { notifications: [], error: "Gagal mengambil notifikasi" }
  }
}

export async function getUnreadNotificationCount() {
  try {
    const session = await auth()
    if (!session?.user?.id) return 0

    const count = await prisma.notification.count({
      where: { 
        userId: session.user.id,
        read: false
      }
    })

    return count
  } catch (error) {
    return 0
  }
}

export async function markNotificationsAsRead() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        read: false
      },
      data: { read: true }
    })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Failed to mark notifications as read:", error)
    return { error: "Gagal memproses" }
  }
}
