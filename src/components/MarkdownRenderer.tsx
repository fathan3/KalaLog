import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string; // Additional classes for the wrapper
  isQuote?: boolean; // Changes some styling if rendered inside the image quote
}

export default function MarkdownRenderer({ content, className = "", isQuote = false }: MarkdownRendererProps) {
  // Convert @username to markdown links
  const processedContent = content.replace(/(^|\s)@([a-zA-Z0-9_]+)/g, '$1[@$2](/profile/$2)');

  return (
    <div className={`prose prose-invert prose-zinc max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ node, ...props }) => (
            <p 
              className={`mb-3 last:mb-0 leading-relaxed font-light ${isQuote ? 'text-zinc-100 text-lg tracking-wide whitespace-pre-wrap' : 'text-zinc-200 text-[17px] tracking-wide whitespace-pre-wrap'}`} 
              {...props} 
            />
          ),
          // Links
          a: ({ node, ...props }) => (
            <a 
              className="text-sky-400 hover:text-sky-300 hover:underline underline-offset-4 transition-colors font-medium break-all" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          // Bold text
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-zinc-100" {...props} />
          ),
          // Italic text
          em: ({ node, ...props }) => (
            <em className="italic text-zinc-300" {...props} />
          ),
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-2 border-sky-500/50 pl-4 py-1 italic text-zinc-400 my-4 bg-sky-500/5 rounded-r-lg" 
              {...props} 
            />
          ),
          // Unordered Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-zinc-200 font-light tracking-wide text-[17px]" {...props} />
          ),
          // Ordered Lists
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-zinc-200 font-light tracking-wide text-[17px]" {...props} />
          ),
          // List Items
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          // Preformatted text (Block Code wrapper)
          pre: ({ node, ...props }) => (
            <pre 
              className="block bg-[#0d1117] text-zinc-200 p-4 rounded-xl text-sm font-mono overflow-x-auto my-4 border border-zinc-800/80 shadow-inner [&>code]:bg-transparent [&>code]:text-inherit [&>code]:p-0 [&>code]:border-none" 
              {...props} 
            />
          ),
          // Inline and Block Code inner element
          code: ({ node, className, children, ...props }: any) => {
            return (
              <code 
                className="bg-zinc-800/80 text-sky-300 px-1.5 py-0.5 rounded-md text-sm font-mono border border-zinc-700/50" 
                {...props}
              >
                {children}
              </code>
            );
          },
          // Strikethrough
          del: ({ node, ...props }) => (
            <del className="line-through text-zinc-500" {...props} />
          ),
          // Headings (rare in microblogs, but good to have)
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-zinc-100 mb-4 mt-6" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-zinc-100 mb-3 mt-5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-zinc-100 mb-2 mt-4" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
