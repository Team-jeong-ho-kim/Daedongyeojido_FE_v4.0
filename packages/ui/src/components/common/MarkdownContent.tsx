"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "../../lib/utils";

type MarkdownContentProps = {
  className?: string;
  content: string;
  emptyFallback?: ReactNode;
};

const MARKDOWN_BLOCK_SPACING = "mb-3 last:mb-0";

export function stripMarkdownToPlainText(content: string) {
  return content
    .replace(/```([\s\S]*?)```/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*([-+*]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function MarkdownContent({
  className,
  content,
  emptyFallback = null,
}: MarkdownContentProps) {
  if (!content.trim()) {
    return emptyFallback;
  }

  return (
    <div
      className={cn(
        "min-w-0 text-[14px] text-gray-700 leading-7 md:text-[15px]",
        className,
      )}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="break-all text-[#0969da] underline underline-offset-2"
              rel="noreferrer noopener"
              target="_blank"
            >
              {children}
            </a>
          ),
          code: ({ children, className: codeClassName, ...props }) => {
            const isBlock = Boolean(codeClassName);

            if (isBlock) {
              return (
                <code
                  {...props}
                  className={cn(
                    "block overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 font-mono text-[13px] text-gray-100",
                    codeClassName,
                  )}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                {...props}
                className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.95em] text-gray-800"
              >
                {children}
              </code>
            );
          },
          h1: ({ children, ...props }) => (
            <h1
              {...props}
              className="mb-4 font-semibold text-[22px] text-gray-900 leading-8"
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              {...props}
              className="mb-4 font-semibold text-[20px] text-gray-900 leading-8"
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              {...props}
              className="mb-3 font-semibold text-[18px] text-gray-900 leading-7"
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              {...props}
              className="mb-3 font-semibold text-[16px] text-gray-900 leading-7"
            >
              {children}
            </h4>
          ),
          hr: (props) => <hr {...props} className="my-4 border-gray-200" />,
          li: ({ children, ...props }) => (
            <li {...props} className="whitespace-pre-wrap">
              {children}
            </li>
          ),
          ol: ({ children, ...props }) => (
            <ol
              {...props}
              className={`${MARKDOWN_BLOCK_SPACING} list-decimal space-y-1 pl-6`}
            >
              {children}
            </ol>
          ),
          p: ({ children, ...props }) => (
            <p
              {...props}
              className={`${MARKDOWN_BLOCK_SPACING} whitespace-pre-wrap`}
            >
              {children}
            </p>
          ),
          pre: ({ children, ...props }) => (
            <pre {...props} className={MARKDOWN_BLOCK_SPACING}>
              {children}
            </pre>
          ),
          strong: ({ children, ...props }) => (
            <strong {...props} className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          ul: ({ children, ...props }) => (
            <ul
              {...props}
              className={`${MARKDOWN_BLOCK_SPACING} list-disc space-y-1 pl-6`}
            >
              {children}
            </ul>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
