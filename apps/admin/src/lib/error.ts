import { ApiError } from "utils";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.description;
  }

  return fallback;
};
