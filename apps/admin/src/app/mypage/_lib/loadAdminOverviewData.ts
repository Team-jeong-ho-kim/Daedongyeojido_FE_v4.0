import { getResultDuration } from "@/api/admin";
import {
  getAllApplicationForms,
  getClubApplicationForms,
} from "@/api/applicationForm";
import { getAllClubs } from "@/api/club";
import type {
  ApplicationFormListItem,
  ResultDurationResponse,
} from "@/types/admin";

export type AdminOverviewData = {
  resultDurationInfo: ResultDurationResponse | null;
  applicationForms: ApplicationFormListItem[];
};

export const loadAdminOverviewData = async (): Promise<AdminOverviewData> => {
  const resultDurationInfo = await getResultDuration().catch(() => null);

  let applicationForms: ApplicationFormListItem[] = [];

  try {
    applicationForms = await getAllApplicationForms();
  } catch {
    const clubsData = await getAllClubs();
    const formsByClub = await Promise.all(
      clubsData.map(async (club) => {
        try {
          return await getClubApplicationForms(String(club.clubId));
        } catch {
          return [];
        }
      }),
    );
    applicationForms = formsByClub.flat();
  }

  const dedupedFormMap = new Map<number, ApplicationFormListItem>();
  applicationForms.forEach((form) => {
    dedupedFormMap.set(form.applicationFormId, form);
  });

  return {
    resultDurationInfo,
    applicationForms: [...dedupedFormMap.values()].sort(
      (a, b) => b.applicationFormId - a.applicationFormId,
    ),
  };
};
