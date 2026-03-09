"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib";

export const useQueryErrorToast = (error: unknown, fallback: string) => {
  useEffect(() => {
    if (!error) return;

    toast.error(getErrorMessage(error, fallback));
  }, [error, fallback]);
};
