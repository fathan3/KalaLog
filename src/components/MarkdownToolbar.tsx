"use client";

import { RefObject } from "react";
import { Bold, Italic, Code, Quote, Link as LinkIcon, List } from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: (val: string) => void;
  disabled?: boolean;
}

export default function MarkdownToolbar({ textareaRef, content, setContent, disabled }: MarkdownToolbarProps) {
  const applyFormat = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const textBefore = content.substring(0, start);
    const textSelected = content.substring(start, end);
    const textAfter = content.substring(end);
    
    // For line-based formatting like Quote or List, we might want to ensure it's on a new line
    // But for simplicity, we just insert the prefix/suffix.
    
    const newContent = textBefore + prefix + textSelected + suffix + textAfter;
    setContent(newContent);
    
    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      // If there was selected text, keep it selected but with the new wrappers
      if (textSelected.length > 0) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + textSelected.length);
      } else {
        // If no text was selected, place cursor in the middle of prefix and suffix
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 0);
  };

  const handleLink = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textSelected = content.substring(start, end);
    
    if (textSelected) {
      // If text is highlighted, wrap it in link syntax
      applyFormat("[", "](url)");
    } else {
      applyFormat("[teks](", ")");
    }
  };

  return (
    <div className="flex items-center space-x-1 p-1.5 bg-black/20 border-b border-white/5 rounded-t-xl mb-[-4px] z-10 relative">
      <ToolbarButton onClick={() => applyFormat("**", "**")} icon={<Bold size={15} />} title="Tebal (Ctrl+B)" disabled={disabled} />
      <ToolbarButton onClick={() => applyFormat("*", "*")} icon={<Italic size={15} />} title="Miring (Ctrl+I)" disabled={disabled} />
      <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
      <ToolbarButton onClick={() => applyFormat("\n> ")} icon={<Quote size={15} />} title="Kutipan" disabled={disabled} />
      <ToolbarButton onClick={() => applyFormat("`", "`")} icon={<Code size={15} />} title="Kode Inline" disabled={disabled} />
      <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
      <ToolbarButton onClick={handleLink} icon={<LinkIcon size={15} />} title="Tautan" disabled={disabled} />
      <ToolbarButton onClick={() => applyFormat("\n- ")} icon={<List size={15} />} title="Daftar" disabled={disabled} />
    </div>
  );
}

function ToolbarButton({ onClick, icon, title, disabled }: { onClick: () => void, icon: React.ReactNode, title: string, disabled?: boolean }) {
  return (
    <button
      type="button" // Prevent form submission
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}
