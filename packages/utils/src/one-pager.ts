import { apiClient } from "./instance";

export interface OnePager {
  onePagerFormId: number;
  title: string;
  teacher: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
}

export const getOnePagers = async (): Promise<OnePager[]> => {
  return [
    { onePagerFormId: 1, title: "제1회 원페이저", teacher: "김현태", onePagerDurationType: "INFINITY", onePagerDuration: null },
    { onePagerFormId: 2, title: "제2회 원페이저", teacher: "김현태", onePagerDurationType: "DATE", onePagerDuration: "2026-05-15T23:59:00" },
    { onePagerFormId: 3, title: "제3회 원페이저", teacher: "김현태", onePagerDurationType: "DATE", onePagerDuration: "2026-05-20T23:59:00" },
    { onePagerFormId: 4, title: "제4회 원페이저", teacher: "김현태", onePagerDurationType: "INFINITY", onePagerDuration: null },
    { onePagerFormId: 5, title: "제5회 원페이저", teacher: "김현태", onePagerDurationType: "DATE", onePagerDuration: "2026-06-01T23:59:00" },
  ];
};
