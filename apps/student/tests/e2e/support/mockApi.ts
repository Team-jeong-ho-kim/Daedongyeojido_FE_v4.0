import type { Page, Route } from "@playwright/test";

type UserRole = "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER" | "TEACHER";
type AlarmCategory = "COMMON" | "CLUB_MEMBER_APPLY" | "CLUB_ACCEPTED";

type MockUser = {
  classNumber: string;
  userName: string;
  profileImage: string | null;
  clubName: string | null;
  major: string[];
  introduction: string | null;
  link: string[];
  role: UserRole;
};

type MockAnnouncementListItem = {
  announcementId: number;
  title: string;
  clubName: string;
  deadline: string;
  clubImage: string | null;
  status: "OPEN" | "CLOSED";
  applicationFormId: number | null;
};

type MockAnnouncementDetail = {
  clubId: number;
  title: string;
  major: string[];
  phoneNumber: string;
  deadline: string;
  introduction: string;
  talentDescription: string;
  assignment: string;
  status: "OPEN" | "CLOSED";
  applicationFormId: number | null;
};

type MockClubListItem = {
  clubId: number;
  clubName: string;
  clubImage: string | null;
  introduction: string;
  majors: string[];
};

type MockClubDetail = {
  club: {
    clubName: string;
    introduction: string;
    oneLiner: string;
    clubImage: string | null;
    majors: string[];
    links: string[];
  };
  clubMembers: Array<{
    userId: number;
    userName: string;
    majors: string[];
    introduction: string;
    profileImage: string | null;
  }>;
};

type MockApplicationForm = {
  applicationFormId: number;
  applicationFormTitle: string;
  submissionDuration: string | [number, number, number];
};

type MockApplicant = {
  submissionId: number;
  userName: string;
  classNumber: string;
  profileImage: string | null;
  major: string;
};

type MockAlarm = {
  id: number;
  title: string;
  content: string;
  category: AlarmCategory;
  clubId?: number;
  referenceId?: number;
  isExecuted?: boolean;
};

type RecordedRequest = {
  method: string;
  pathname: string;
  body: unknown;
  rawBody: string | null;
};

export type StudentApiMockController = {
  requests: RecordedRequest[];
  getLastRequest: (
    matcher: RegExp | string,
    method?: string,
  ) => RecordedRequest | undefined;
};

type StudentApiMockOptions = {
  user?: Partial<MockUser>;
  updatedUser?: Partial<MockUser>;
  announcements?: MockAnnouncementListItem[];
  announcementDetail?: Partial<MockAnnouncementDetail>;
  clubs?: MockClubListItem[];
  clubDetail?: Partial<MockClubDetail>;
  applicationForms?: MockApplicationForm[];
  applicants?: MockApplicant[];
  userAlarms?: MockAlarm[];
  clubAlarms?: MockAlarm[];
  clubAnnouncements?: MockAnnouncementListItem[];
};

const DEFAULT_USER: MockUser = {
  classNumber: "2301",
  userName: "테스트유저",
  profileImage: "/images/icons/profile.svg",
  clubName: "테스트동아리",
  major: ["BE"],
  introduction: "안녕하세요",
  link: ["https://example.com/profile"],
  role: "STUDENT",
};

const DEFAULT_ANNOUNCEMENTS: MockAnnouncementListItem[] = [
  {
    announcementId: 1,
    title: "백엔드 모집",
    clubName: "테스트동아리",
    deadline: "2026-12-31",
    clubImage: "/images/icons/profile.svg",
    status: "OPEN",
    applicationFormId: 11,
  },
];

const DEFAULT_ANNOUNCEMENT_DETAIL: MockAnnouncementDetail = {
  clubId: 1,
  title: "백엔드 모집",
  major: ["BE"],
  phoneNumber: "01012341234",
  deadline: "2026-12-31",
  introduction: "동아리 소개",
  talentDescription: "열정 있는 학생",
  assignment: "간단 과제",
  status: "OPEN",
  applicationFormId: 11,
};

const DEFAULT_CLUBS: MockClubListItem[] = [
  {
    clubId: 1,
    clubName: "테스트동아리",
    clubImage: "/images/icons/profile.svg",
    introduction: "테스트 소개",
    majors: ["BE"],
  },
];

const DEFAULT_CLUB_DETAIL: MockClubDetail = {
  club: {
    clubName: "테스트동아리",
    introduction: "테스트 소개",
    oneLiner: "한 줄 소개",
    clubImage: "/images/icons/profile.svg",
    majors: ["BE"],
    links: ["https://example.com"],
  },
  clubMembers: [
    {
      userId: 1,
      userName: "홍길동",
      majors: ["BE"],
      introduction: "멤버 소개",
      profileImage: "/images/icons/profile.svg",
    },
  ],
};

const DEFAULT_APPLICATION_FORMS: MockApplicationForm[] = [
  {
    applicationFormId: 11,
    applicationFormTitle: "2026 백엔드 지원서",
    submissionDuration: "2026-12-31",
  },
];

const DEFAULT_APPLICANTS: MockApplicant[] = [
  {
    submissionId: 501,
    userName: "김지원",
    classNumber: "2401",
    profileImage: "/images/icons/profile.svg",
    major: "BE",
  },
];

const DEFAULT_USER_ALARMS: MockAlarm[] = [
  {
    id: 101,
    title: "팀원 추가 신청",
    content: "홍길동 학생이 팀원 추가를 신청했습니다.",
    category: "CLUB_MEMBER_APPLY",
    isExecuted: false,
  },
];

const DEFAULT_CLUB_ALARMS: MockAlarm[] = [
  {
    id: 201,
    title: "동아리 공지",
    content: "다음 주 정기 회의가 예정되어 있습니다.",
    category: "COMMON",
  },
];

const isApiDataRequest = (route: Route) => {
  const resourceType = route.request().resourceType();
  return resourceType === "fetch" || resourceType === "xhr";
};

const createJsonResponse = async (
  route: Route,
  body: unknown,
  status = 200,
) => {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
};

const parseRequestBody = (
  route: Route,
): {
  body: unknown;
  rawBody: string | null;
} => {
  const rawBody = route.request().postData() ?? null;

  if (!rawBody) {
    return { body: null, rawBody };
  }

  try {
    return {
      body: JSON.parse(rawBody),
      rawBody,
    };
  } catch {
    return {
      body: rawBody,
      rawBody,
    };
  }
};

export const buildAnnouncements = (
  count: number,
): MockAnnouncementListItem[] => {
  return Array.from({ length: count }, (_, index) => {
    const announcementId = index + 1;
    return {
      announcementId,
      title: `테스트 공고 ${announcementId}`,
      clubName: `테스트동아리 ${announcementId}`,
      deadline: "2026-12-31",
      clubImage: "/images/icons/profile.svg",
      status: "OPEN",
      applicationFormId: 100 + announcementId,
    };
  });
};

export const buildClubs = (count: number): MockClubListItem[] => {
  return Array.from({ length: count }, (_, index) => {
    const clubId = index + 1;
    return {
      clubId,
      clubName: `테스트동아리 ${clubId}`,
      clubImage: "/images/icons/profile.svg",
      introduction: `테스트동아리 ${clubId} 소개`,
      majors: ["BE"],
    };
  });
};

export async function installStudentApiMocks(
  page: Page,
  options: StudentApiMockOptions = {},
): Promise<StudentApiMockController> {
  let user: MockUser = {
    ...DEFAULT_USER,
    ...options.user,
  };

  const updatedUser: MockUser = {
    ...user,
    ...options.updatedUser,
  };

  const announcements = options.announcements ?? DEFAULT_ANNOUNCEMENTS.slice();
  let announcementDetail: MockAnnouncementDetail = {
    ...DEFAULT_ANNOUNCEMENT_DETAIL,
    ...options.announcementDetail,
  };
  const clubs = options.clubs ?? DEFAULT_CLUBS.slice();
  const clubAnnouncements = options.clubAnnouncements ?? announcements;
  const clubDetail: MockClubDetail = {
    club: {
      ...DEFAULT_CLUB_DETAIL.club,
      ...(options.clubDetail?.club ?? {}),
    },
    clubMembers:
      options.clubDetail?.clubMembers ?? DEFAULT_CLUB_DETAIL.clubMembers,
  };
  const applicationForms =
    options.applicationForms ?? DEFAULT_APPLICATION_FORMS.slice();
  const applicants = options.applicants ?? DEFAULT_APPLICANTS.slice();
  let userAlarms = options.userAlarms ?? DEFAULT_USER_ALARMS.slice();
  let clubAlarms = options.clubAlarms ?? DEFAULT_CLUB_ALARMS.slice();

  const requests: RecordedRequest[] = [];

  const recordRequest = (route: Route) => {
    const url = new URL(route.request().url());
    const { body, rawBody } = parseRequestBody(route);

    requests.push({
      method: route.request().method(),
      pathname: url.pathname,
      body,
      rawBody,
    });
  };

  const handleApiFallback = async (route: Route) => {
    if (!isApiDataRequest(route)) {
      await route.continue();
      return true;
    }

    return false;
  };

  await page.route(/.*\/auth\/logout$/, async (route) => {
    if (await handleApiFallback(route)) return;
    recordRequest(route);
    await route.fulfill({ status: 204, body: "" });
  });

  await page.route(/.*\/users\/my-info$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);
    user = { ...updatedUser };
    await createJsonResponse(route, user);
  });

  await page.route(/.*\/users\/members$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const payload = parseRequestBody(route).body as {
      isApproved?: boolean;
      alarmId?: number;
    } | null;
    if (payload?.alarmId) {
      userAlarms = userAlarms.map((alarm) =>
        alarm.id === payload.alarmId ? { ...alarm, isExecuted: true } : alarm,
      );
    }

    await createJsonResponse(route, { success: true });
  });

  await page.route(/.*\/users\/submissions$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const payload = parseRequestBody(route).body as {
      isSelected?: boolean;
      alarmId?: number;
    } | null;
    if (payload?.alarmId) {
      userAlarms = userAlarms.map((alarm) =>
        alarm.id === payload.alarmId ? { ...alarm, isExecuted: true } : alarm,
      );
    }

    await createJsonResponse(route, { success: true });
  });

  await page.route(/.*\/users$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, user);
  });

  await page.route(/.*\/announcements\/open\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const payload = parseRequestBody(route).body as {
      applicationFormId?: number;
    } | null;
    announcementDetail = {
      ...announcementDetail,
      status: "OPEN",
      applicationFormId: payload?.applicationFormId ?? null,
    };

    await createJsonResponse(route, { success: true });
  });

  await page.route(/.*\/announcements\/clubs\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      clubAnnouncements,
    });
  });

  await page.route(/.*\/announcements\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, announcementDetail);
  });

  await page.route(/.*\/announcements$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      announcements,
    });
  });

  await page.route(/.*\/clubs\/alarms\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "DELETE") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const alarmId = Number(route.request().url().split("/").pop());
    clubAlarms = clubAlarms.filter((alarm) => alarm.id !== alarmId);
    await route.fulfill({ status: 204, body: "" });
  });

  await page.route(/.*\/clubs\/submissions\/all\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      applicants,
    });
  });

  await page.route(/.*\/clubs\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, clubDetail);
  });

  await page.route(/.*\/clubs$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      clubs,
    });
  });

  await page.route(/.*\/application-forms\/clubs\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      applicationForms,
    });
  });

  await page.route(/.*\/alarms\/users$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      alarms: userAlarms,
    });
  });

  await page.route(/.*\/alarms\/clubs$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      alarms: clubAlarms,
    });
  });

  return {
    requests,
    getLastRequest: (matcher, method) => {
      const normalizedMethod = method?.toUpperCase();

      return [...requests].reverse().find((request) => {
        const methodMatches = normalizedMethod
          ? request.method === normalizedMethod
          : true;
        const pathMatches =
          typeof matcher === "string"
            ? request.pathname.includes(matcher)
            : matcher.test(request.pathname);

        return methodMatches && pathMatches;
      });
    },
  };
}

export async function setAuthSession(
  page: Page,
  options?: {
    role?: UserRole;
    userName?: string;
  },
) {
  const role = options?.role ?? "STUDENT";
  const userName = options?.userName ?? "테스트유저";

  await page.addInitScript(
    ({ injectedRole, injectedUserName }) => {
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = "access_token=mock-access-token; path=/";
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = "refresh_token=mock-refresh-token; path=/";
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = `auth_role=${injectedRole}; path=/`;
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = `auth_user_name=${encodeURIComponent(injectedUserName)}; path=/`;
    },
    {
      injectedRole: role,
      injectedUserName: userName,
    },
  );
}
