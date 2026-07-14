"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import MarkdownRenderer from "./MarkdownRenderer";

interface ExportQuoteDialogProps {
  content: string;
  author: string;
  handle: string;
  date?: string;
  time?: string;
}

export default function ExportQuoteDialog({ content, author, handle, date, time }: ExportQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 3, // High resolution for social media
        style: {
          transform: "scale(1)", // Ensure it's not scaled by CSS during export
        }
      });
      
      const link = document.createElement("a");
      link.download = `kalalog-quote-${handle}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      setOpen(false);
    } catch (err) {
      console.error("Failed to export image", err);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex items-center space-x-2 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer group"
        title="Jadikan Gambar"
      >
        <div className="p-1.5 rounded-full group-hover:bg-emerald-400/10 transition-colors">
          <Share2 className="w-4 h-4" />
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-zinc-200">Bagikan sebagai Gambar</DialogTitle>
        </DialogHeader>

        {/* The Quote Canvas (This is what gets exported) */}
        <div className="px-6 py-4 flex justify-center bg-black/40">
          <div 
            ref={printRef}
            className="relative w-full aspect-square max-w-[400px] flex flex-col justify-center items-center p-8 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-zinc-800/50 shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 opacity-80"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl"></div>

            {/* Quote Icon */}
            <div className="text-zinc-700/50 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L8 15H11V19H5V15L7 11H5V7H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V7H21V11H20Z" />
              </svg>
            </div>

            {/* Quote Content */}
            <div className="z-10 w-full text-center font-serif">
              <MarkdownRenderer content={content} isQuote={true} className="mx-auto" />
            </div>

            {/* Author Info */}
            <div className="mt-8 flex flex-col items-center z-10">
              <span className="text-sm text-zinc-300 font-semibold tracking-wide">
                {author}
              </span>
              <span className="text-xs text-zinc-500 mt-0.5">
                @{handle} {date ? `• ${date}` : ''}
              </span>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="text-[10px] font-bold text-zinc-700 tracking-[0.2em] uppercase">KalaLog</span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 flex justify-end gap-3 bg-black/40">
          <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            Batal
          </Button>
          <Button 
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
          >
            {isExporting ? "Menyimpan..." : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Unduh Gambar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
