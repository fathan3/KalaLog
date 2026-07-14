"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createPost(content: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to post." }
    }
    
    if (!content || content.trim() === "") {
      return { error: "Content cannot be empty." }
    }
    
    await prisma.post.create({
      data: {
        content,
        userId: session.user.id
      }
    })
    
    revalidatePath("/")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { error: "Failed to create post. Please try again." }
  }
}
