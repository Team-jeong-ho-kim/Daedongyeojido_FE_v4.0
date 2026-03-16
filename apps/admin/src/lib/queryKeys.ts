import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  admin: {
    overview: null,
    resultDuration: null,
    documentFiles: null,
    clubCreationApplications: null,
    clubCreationApplicationDetail: (clubId: string) => [clubId],
  },
  clubs: {
    all: null,
    detail: (clubId: string) => [clubId],
    announcements: (clubId: string) => [clubId],
  },
  announcements: {
    all: null,
    detail: (announcementId: string) => [announcementId],
  },
});
