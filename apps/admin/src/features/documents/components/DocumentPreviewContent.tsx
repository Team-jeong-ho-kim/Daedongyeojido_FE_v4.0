"use client";

import { useEffect, useState } from "react";
import { DocumentPreviewViewport } from "ui";
import { getDocumentPreviewMode } from "utils";

type DocumentPreviewContentProps = {
  fileName: string;
  fileUrl: string;
};

const PREVIEW_LAYOUT_STYLES = `
  html {
    background: #f8fafc;
  }

  body {
    margin: 0 !important;
    background: #f8fafc;
  }

  #preview-root {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 100vh;
    padding: 24px 0;
    box-sizing: border-box;
  }

  #preview-content {
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
  }

  #preview-content > * {
    margin-left: auto !important;
    margin-right: auto !important;
    flex: 0 0 auto;
  }

  #preview-content > * + * {
    margin-top: 16px;
  }
`;

const wrapPreviewBody = (content: string) =>
  `<div id="preview-root"><div id="preview-content">${content}</div></div>`;

const wrapHtmlDocument = (html: string, fileName: string) => {
  if (/<html[\s>]/i.test(html) || /<!doctype/i.test(html)) {
    const styleTag = `<style data-doc-preview-layout>${PREVIEW_LAYOUT_STYLES}</style>`;
    const htmlWithStyles = /<head[\s>]/i.test(html)
      ? html.replace(/<\/head>/i, `${styleTag}</head>`)
      : html.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);

    if (/<body[\s>]/i.test(htmlWithStyles)) {
      return htmlWithStyles.replace(
        /<body([^>]*)>([\s\S]*?)<\/body>/i,
        (_, attributes: string, bodyContent: string) =>
          `<body${attributes}>${wrapPreviewBody(bodyContent)}</body>`,
      );
    }

    return htmlWithStyles.replace(
      /<\/html>/i,
      `<body>${wrapPreviewBody("")}</body></html>`,
    );
  }

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${fileName}</title>
    <style>${PREVIEW_LAYOUT_STYLES}</style>
  </head>
  <body>${wrapPreviewBody(html)}</body>
</html>`;
};

const withFilteredDebugLogs = <T,>(callback: () => T) => {
  const originalLog = console.log;
  const originalDebug = console.debug;
  const originalWarn = console.warn;
  const originalError = console.error;

  const shouldFilter = (args: unknown[]) =>
    typeof args[0] === "string" && args[0].startsWith("DEBUG_LINESEG:");

  const createWrapper =
    (originalMethod: typeof console.log) =>
    (...args: unknown[]) => {
      if (shouldFilter(args)) {
        return;
      }

      originalMethod(...args);
    };

  console.log = createWrapper(originalLog);
  console.debug = createWrapper(originalDebug);
  console.warn = createWrapper(originalWarn);
  console.error = createWrapper(originalError);

  try {
    return callback();
  } finally {
    console.log = originalLog;
    console.debug = originalDebug;
    console.warn = originalWarn;
    console.error = originalError;
  }
};

export function DocumentPreviewContent({
  fileName,
  fileUrl,
}: DocumentPreviewContentProps) {
  const previewMode = getDocumentPreviewMode(fileName, fileUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      setIsLoading(false);
      setErrorMessage("문서 미리보기 경로가 올바르지 않습니다.");
      setPreviewHtml(null);
      setPreviewObjectUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      return;
    }

    if (previewMode === "unsupported") {
      setIsLoading(false);
      setErrorMessage(null);
      setPreviewHtml(null);
      setPreviewObjectUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      return;
    }

    let isDisposed = false;
    let nextObjectUrl: string | null = null;

    const loadPreview = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setPreviewHtml(null);
      setPreviewObjectUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("문서 미리보기 응답이 올바르지 않습니다.");
        }

        const arrayBuffer = await response.arrayBuffer();
        if (isDisposed) {
          return;
        }

        if (previewMode === "pdf") {
          nextObjectUrl = URL.createObjectURL(
            new Blob([arrayBuffer], { type: "application/pdf" }),
          );

          if (isDisposed) {
            URL.revokeObjectURL(nextObjectUrl);
            return;
          }

          setPreviewObjectUrl(nextObjectUrl);
          setIsLoading(false);
          return;
        }

        const { toHtml } = await import("@ohah/hwpjs");
        const hwpHtml = withFilteredDebugLogs(() =>
          toHtml(new Uint8Array(arrayBuffer) as never),
        );

        if (isDisposed) {
          return;
        }

        setPreviewHtml(wrapHtmlDocument(hwpHtml, fileName));
        setIsLoading(false);
      } catch {
        if (nextObjectUrl) {
          URL.revokeObjectURL(nextObjectUrl);
        }

        if (!isDisposed) {
          setErrorMessage("문서 미리보기를 불러오지 못했습니다.");
          setIsLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      isDisposed = true;

      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
    };
  }, [fileName, fileUrl, previewMode]);

  return (
    <div data-doc-preview-page className="min-h-screen bg-gray-50 p-3 md:p-5">
      <style jsx global>{`
        body:has([data-doc-preview-page]) header,
        body:has([data-doc-preview-page]) footer {
          display: none !important;
        }

        body:has([data-doc-preview-page]) [data-layout-content-offset] {
          padding-top: 0 !important;
        }

        body:has([data-doc-preview-page]) main {
          min-height: 100vh;
        }
      `}</style>

      <DocumentPreviewViewport
        errorMessage={errorMessage}
        fileName={fileName}
        fileUrl={fileUrl}
        isLoading={isLoading}
        previewHtml={previewHtml}
        previewMode={previewMode}
        previewObjectUrl={previewObjectUrl}
      />
    </div>
  );
}
