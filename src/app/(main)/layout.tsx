import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background selection:bg-zinc-800 selection:text-white">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
