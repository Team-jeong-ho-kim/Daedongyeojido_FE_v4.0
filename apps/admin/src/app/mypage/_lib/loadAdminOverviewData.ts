import { getResultDuration } from "@/api/admin";
import type { ResultDurationResponse } from "@/types/admin";

export type AdminOverviewData = {
  resultDurationInfo: ResultDurationResponse | null;
};

export const loadAdminOverviewData = async (): Promise<AdminOverviewData> => {
  const resultDurationInfo = await getResultDuration().catch(() => null);

  return {
    resultDurationInfo,
  };
};
