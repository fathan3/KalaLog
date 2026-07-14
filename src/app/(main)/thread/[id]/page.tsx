export default function ThreadPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center min-h-screen py-8">
      <h1 className="text-2xl font-bold text-foreground">Thread {params.id}</h1>
      <p className="text-muted-foreground mt-2">Detail dari log / thread ini.</p>
    </main>
  )
}
