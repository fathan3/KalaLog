"use server"

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createThread(content: string, userId: string, path: string) {
  try {
    await prisma.post.create({
      data: {
        content,
        userId,
      }
    });

    revalidatePath(path); 
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}
