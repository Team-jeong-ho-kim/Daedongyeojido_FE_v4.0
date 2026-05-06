"use client";

import type { ReactNode } from "react";

interface OnePagerSubmissionItemProps {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export function OnePagerSubmissionItem({
  label,
  onClick,
  icon,
  href,
  target,
  rel,
}: OnePagerSubmissionItemProps) {
  const content = (
    <>
      <span className="font-medium text-gray-800 text-sm">{label}</span>
      {icon && (
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-300 text-white">
          {icon}
        </span>
      )}
    </>
  );

  const className = "inline-flex items-center gap-3 rounded-full border border-red-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
