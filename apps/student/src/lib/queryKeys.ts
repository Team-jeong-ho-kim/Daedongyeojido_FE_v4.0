import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  clubs: {
    all: null,
    detail: (clubId: string) => [clubId],
  },
  announcements: {
    all: null,
    detail: (announcementId: string) => [announcementId],
    byClub: (clubId: string) => [clubId],
  },
  applicationForms: {
    byClub: (clubId: string) => [clubId],
    detail: (applicationFormId: string) => [applicationFormId],
  },
  applications: {
    all: null,
    mine: null,
    submissions: null,
    submissionDetail: (submissionId: string) => [submissionId],
    mySubmission: (submissionId: string) => [submissionId],
    history: null,
  },
  alarms: {
    user: null,
    club: null,
  },
  user: {
    me: null,
  },
});
