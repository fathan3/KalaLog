# KalaLog - MVP Implementation Guide

Dokumen ini memetakan langkah implementasi teknis dari nol hingga MVP fungsional untuk platform microblogging **KalaLog**. Dirancang dengan prinsip bahwa efisiensi adalah pendorong utama dalam pengembangan sistem—mengotomatisasi konfigurasi dasar agar fokus bisa diarahkan penuh pada logika *routing* dan arsitektur data.

## 1. Tech Stack Overview
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn UI (Tema Monokrom/Dominan Hitam)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js (v5 / Auth.js)

---

## 2. Fase 1: Inisialisasi & Setup Lingkungan

Jalankan perintah berikut secara berurutan di terminal untuk membangun fondasi proyek:

```bash
# 1. Buat proyek Next.js baru dengan Tailwind & TypeScript
npx create-next-app@latest kalalog --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Masuk ke direktori proyek
cd kalalog

# 2. Inisialisasi komponen UI (Shadcn)
npx shadcn-ui@latest init

# 3. Instal dependensi Prisma & Database
npm install @prisma/client @auth/prisma-adapter
npm install -D prisma

# 4. Inisialisasi Prisma
npx prisma init

# 5. Instal dependensi NextAuth
npm install next-auth@beta
```

---

## 3. Fase 2: Konfigurasi Database (Prisma)

Buka file `prisma/schema.prisma` dan masukkan skema berikut. Skema ini telah dirancang seramping mungkin.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  likes         Like[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Post {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  userId    String
  
  parentId  String?  
  parent    Post?    @relation("Replies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Post[]   @relation("Replies")
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes     Like[]

  @@index([createdAt(sort: Desc)])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId]) 
}
```

Eksekusi migrasi ke database:
```bash
npx prisma db push
```

---

## 4. Fase 3: Struktur Direktori Utama

Arsitektur folder di dalam direktori `src/`:

```text
src/
├── app/
│   ├── (auth)/             
│   │   └── login/page.tsx
│   ├── (main)/             
│   │   ├── page.tsx        
│   │   ├── thread/
│   │   │   └── [id]/page.tsx 
│   │   └── profile/
│   │       └── [username]/page.tsx 
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/route.ts 
│   ├── layout.tsx
│   └── globals.css         # <-- Pengaturan tema ada di sini
├── components/
│   ├── ui/                 
│   ├── shared/             
│   └── cards/              
├── lib/
│   ├── prisma.ts           
│   ├── auth.ts             
│   └── utils.ts            
└── actions/                
    ├── thread.actions.ts   
    └── user.actions.ts     
```

---

## 5. Fase 4: Konfigurasi Tema (Hitam Putih / Monokrom)

Timpa seluruh isi file `src/app/globals.css` dengan kode berikut untuk memaksa *root* aplikasi menggunakan palet warna hitam dominan dengan aksen putih. Ini akan otomatis terintegrasi dengan Tailwind dan komponen Shadcn UI.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Background utama hitam pekat */
    --background: 0 0% 0%;
    /* Teks utama putih murni */
    --foreground: 0 0% 100%;
    
    /* Warna untuk card (seperti kotak thread) - sedikit lebih terang dari background */
    --card: 0 0% 4%;
    --card-foreground: 0 0% 100%;
    
    --popover: 0 0% 4%;
    --popover-foreground: 0 0% 100%;
    
    /* Warna utama (tombol, dll) diubah menjadi putih dengan teks hitam untuk kontras */
    --primary: 0 0% 100%;
    --primary-foreground: 0 0% 0%;
    
    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 100%;
    
    /* Warna muted untuk teks sekunder (seperti timestamp/username) */
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 65%;
    
    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 100%;
    
    /* Border untuk memisahkan antar thread */
    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 0 0% 100%;
    
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 6. Fase 5: Integrasi Server Actions

Contoh pembuatan `src/actions/thread.actions.ts` untuk menghindari API Routes yang repetitif:

```typescript
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
  } catch (error) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}
```
