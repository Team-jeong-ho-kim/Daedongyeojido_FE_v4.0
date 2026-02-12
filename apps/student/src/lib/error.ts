import { ApiError } from "utils";

/**
 * 에러 객체에서 사용자에게 표시할 메시지를 추출합니다.
 * ApiError인 경우 description을 반환하고, 그 외의 경우 fallback 메시지를 반환합니다.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.description;
  }
  return fallback;
};
