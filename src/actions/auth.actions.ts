"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "Semua kolom wajib diisi" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email ini sudah terdaftar. Silakan gunakan email lain atau login." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  let baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
  let uniqueUsername = baseUsername + Math.floor(Math.random() * 1000)
  
  let isUnique = false
  while (!isUnique) {
    const existing = await prisma.user.findUnique({ where: { username: uniqueUsername } })
    if (existing) {
      uniqueUsername = baseUsername + Math.floor(Math.random() * 10000)
    } else {
      isUnique = true
    }
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      username: uniqueUsername,
    },
  })

  redirect("/login")
}
