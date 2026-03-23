"use client";

import { type QueryKey, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const MAX_TIMEOUT_MS = 2_147_483_647;

interface UseInvalidateQueriesAtResultTimeOptions {
  invalidateQueryKeys: QueryKey[];
  resultDuration?: string | null;
}

export const useInvalidateQueriesAtResultTime = ({
  invalidateQueryKeys,
  resultDuration,
}: UseInvalidateQueriesAtResultTimeOptions) => {
  const queryClient = useQueryClient();
  const invalidateQueryKeysRef = useRef(invalidateQueryKeys);

  invalidateQueryKeysRef.current = invalidateQueryKeys;

  useEffect(() => {
    const invalidateQueries = () => {
      for (const queryKey of invalidateQueryKeysRef.current) {
        void queryClient.invalidateQueries({ queryKey });
      }
    };

    if (!resultDuration) {
      return;
    }

    const resultTime = new Date(resultDuration).getTime();
    if (Number.isNaN(resultTime)) {
      return;
    }

    let timeoutId: number | undefined;

    const scheduleInvalidate = () => {
      const remainingTime = resultTime - Date.now();

      if (remainingTime <= 0) {
        invalidateQueries();
        return;
      }

      timeoutId = window.setTimeout(
        scheduleInvalidate,
        Math.min(remainingTime, MAX_TIMEOUT_MS),
      );
    };

    scheduleInvalidate();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [queryClient, resultDuration]);
};
