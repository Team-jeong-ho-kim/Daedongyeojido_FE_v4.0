import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  admin: {
    overview: null,
    resultDuration: null,
    clubCreationForm: (clubId: string) => [clubId],
    clubCreationDownload: (clubCreationFormId: string) => [clubCreationFormId],
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
