"use client";

import type { ReactNode } from "react";
import type { OnePagerCommentItem } from "./types";

export type { OnePagerCommentItem };

interface BaseOnePagerDetailViewProps {
  title: string;
  description: string;
  statusSlot?: ReactNode;
  leftBottomSlot?: ReactNode;
  rightPanelSlot?: ReactNode;
  extraContentSlot?: ReactNode;
}

export function BaseOnePagerDetailView({
  title,
  description,
  statusSlot,
  leftBottomSlot,
  rightPanelSlot,
  extraContentSlot,
}: BaseOnePagerDetailViewProps) {
  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 py-14">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_580px]">
        <section className="pt-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-bold text-[50px] text-gray-800 leading-none">
              {title}
            </h1>
            {statusSlot ? <div>{statusSlot}</div> : null}
          </div>

          <p className="mt-7 max-w-5xl break-keep font-medium text-[18px] text-gray-600 leading-[1.4]">
            {description}
          </p>
          <div className="mt-7 h-px w-full bg-gray-200" />

          {leftBottomSlot ? <div className="mt-8">{leftBottomSlot}</div> : null}
        </section>

        <section className="space-y-8">
          {rightPanelSlot}
          {extraContentSlot}
        </section>
      </div>
    </div>
  );
}
