"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createPost(content: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error("Unauthenticated")
    }

    await prisma.post.create({
      data: {
        content,
        userId: session.user.id
      }
    })

    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Failed to create post:", error)
    throw new Error("Failed to create post")
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { error: "Terjadi kesalahan" };
  }
}

export async function replyToPost(postId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    if (!content || !content.trim()) {
      return { error: "Konten tidak boleh kosong" };
    }

    await prisma.post.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        parentId: postId
      }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to reply:", error);
    return { error: "Gagal membalas catatan" };
  }
}
