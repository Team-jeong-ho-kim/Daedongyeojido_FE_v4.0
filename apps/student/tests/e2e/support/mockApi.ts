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

type MockApplicationFormDetail = {
  applicationFormTitle: string;
  clubName: string;
  clubImage: string | null;
  content: Array<{
    applicationQuestionId: number;
    content: string;
  }>;
  submissionDuration: string | [number, number, number];
  major: string[];
};

type MockApplicant = {
  submissionId: number;
  userName: string;
  classNumber: string;
  profileImage: string | null;
  major: string;
};

type MockMySubmissionDetail = {
  clubName: string;
  clubImage?: string;
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  availableMajors?: string[];
  contents: Array<{
    question: string;
    answer: string;
    applicationQuestionId?: number;
    applicationAnswerId?: number;
  }>;
  submissionDuration: string | [number, number, number];
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

type MockDocumentFile = {
  fileId: number;
  fileName: string;
  fileUrl: string;
};

type MockTeacher = {
  teacherId: number;
  teacherName: string;
  matched: boolean;
};

type MockClubCreationReview = {
  reviewId: number;
  reviewerType: "ADMIN" | "TEACHER";
  reviewerName: string;
  revision: number;
  decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
  feedback: string | null;
  updatedAt: string;
};

const getReviewKey = (review: MockClubCreationReview) => {
  return [
    review.reviewId,
    review.reviewerType,
    review.revision,
    review.updatedAt,
  ].join(":");
};

type MockClubCreationApplicationDetail = {
  applicationId: number;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REJECTED";
  revision: number;
  clubName: string;
  clubImage: string | null;
  clubCreationForm: string | null;
  oneLiner: string;
  introduction: string;
  majors: string[];
  links: string[];
  applicant: {
    userId: number;
    userName: string;
    classNumber: string;
  };
  submittedAt: string | null;
  lastSubmittedAt: string | null;
  currentReviews: MockClubCreationReview[];
  reviewHistory: MockClubCreationReview[];
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
  setTeachers: (nextTeachers: MockTeacher[]) => void;
};

type StudentApiMockOptions = {
  user?: Partial<MockUser>;
  updatedUser?: Partial<MockUser>;
  announcements?: MockAnnouncementListItem[];
  announcementDetail?: Partial<MockAnnouncementDetail>;
  clubs?: MockClubListItem[];
  clubDetail?: Partial<MockClubDetail>;
  applicationForms?: MockApplicationForm[];
  applicationFormDetail?: Partial<MockApplicationFormDetail>;
  applicants?: MockApplicant[];
  userAlarms?: MockAlarm[];
  clubAlarms?: MockAlarm[];
  clubAnnouncements?: MockAnnouncementListItem[];
  documentFiles?: MockDocumentFile[];
  mySubmissionDetail?: MockMySubmissionDetail;
  teachers?: MockTeacher[];
  teachersStatus?: number;
  myClubCreationApplication?: MockClubCreationApplicationDetail | null;
  myClubCreationApplicationStatus?: number;
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

const DEFAULT_APPLICATION_FORM_DETAIL: MockApplicationFormDetail = {
  applicationFormTitle: "2026 백엔드 지원서",
  clubName: "테스트동아리",
  clubImage: "/images/icons/profile.svg",
  content: [
    {
      applicationQuestionId: 1,
      content: "지원 동기를 작성해주세요.",
    },
  ],
  submissionDuration: "2026-12-31",
  major: ["BE"],
};

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

const DEFAULT_DOCUMENT_FILES: MockDocumentFile[] = [
  {
    fileId: 1,
    fileName: "2026 동아리 개설 신청 양식",
    fileUrl: "https://files.test/club-creation-form.hwp",
  },
];

const DEFAULT_MY_SUBMISSION_DETAIL: MockMySubmissionDetail = {
  clubName: "테스트동아리",
  clubImage: "/images/icons/profile.svg",
  userName: "테스트유저",
  classNumber: "2301",
  introduction: "짧은 자기소개입니다.",
  major: "BE",
  availableMajors: ["BE", "FE"],
  contents: [
    {
      question: "지원 동기를 작성해주세요.",
      answer: "짧은 답변입니다.",
      applicationQuestionId: 1,
      applicationAnswerId: 101,
    },
  ],
  submissionDuration: "2026-12-31",
};

const DEFAULT_TEACHERS: MockTeacher[] = [
  {
    teacherId: 4,
    teacherName: "asdf",
    matched: false,
  },
  {
    teacherId: 3,
    teacherName: "농구공",
    matched: true,
  },
  {
    teacherId: 1,
    teacherName: "선생님",
    matched: false,
  },
  {
    teacherId: 2,
    teacherName: "선생님",
    matched: false,
  },
];

export const DEFAULT_MY_CLUB_CREATION_APPLICATION: MockClubCreationApplicationDetail =
  {
    applicationId: 41,
    status: "CHANGES_REQUESTED",
    revision: 2,
    clubName: "테스트동아리",
    clubImage: "/images/icons/profile.svg",
    clubCreationForm: "/documents/previews/1.pdf",
    oneLiner: "같이 성장하는 동아리",
    introduction: "프로젝트와 협업 중심으로 운영하는 테스트 동아리입니다.",
    majors: ["BE"],
    links: ["https://example.com/club"],
    applicant: {
      userId: 10,
      userName: "테스트유저",
      classNumber: "2301",
    },
    submittedAt: "2026-03-18T09:00:00",
    lastSubmittedAt: "2026-03-18T11:00:00",
    currentReviews: [
      {
        reviewId: 900,
        reviewerType: "TEACHER",
        reviewerName: "선생님",
        revision: 2,
        decision: "CHANGES_REQUESTED",
        feedback: "활동 계획을 조금 더 구체적으로 작성해주세요.",
        updatedAt: "2026-03-18T12:00:00",
      },
    ],
    reviewHistory: [],
  };

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

const createApiErrorResponse = (
  description: string,
  status: number,
  message = "server fault",
) => {
  return {
    description,
    message,
    status,
    timestamp: "2026-03-17T00:00:00.000Z",
  };
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

const getMultipartFieldValues = (
  rawBody: string | null | undefined,
  fieldName: string,
) => {
  if (!rawBody) {
    return [];
  }

  const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = rawBody.matchAll(
    new RegExp(`name="${escapedFieldName}"\\r\\n\\r\\n([^\\r]+)`, "g"),
  );

  return [...matches].map((match) => match[1]).filter(Boolean);
};

const getMultipartFieldValue = (
  rawBody: string | null | undefined,
  fieldName: string,
) => {
  return getMultipartFieldValues(rawBody, fieldName)[0] ?? null;
};

const updateApplicationFromMultipart = (
  application: MockClubCreationApplicationDetail,
  rawBody: string | null,
) => {
  const clubName = getMultipartFieldValue(rawBody, "clubName");
  const oneLiner = getMultipartFieldValue(rawBody, "oneLiner");
  const introduction = getMultipartFieldValue(rawBody, "introduction");
  const majors = getMultipartFieldValues(rawBody, "major");
  const links = getMultipartFieldValues(rawBody, "link");

  return {
    ...application,
    clubName: clubName ?? application.clubName,
    oneLiner: oneLiner ?? application.oneLiner,
    introduction: introduction ?? application.introduction,
    majors: majors.length > 0 ? majors : application.majors,
    links: links.length > 0 ? links : application.links,
  };
};

const dedupeReviews = (reviews: MockClubCreationReview[]) => {
  const seenKeys = new Set<string>();

  return reviews.filter((review) => {
    const reviewKey = getReviewKey(review);

    if (seenKeys.has(reviewKey)) {
      return false;
    }

    seenKeys.add(reviewKey);
    return true;
  });
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
  const applicationFormDetail: MockApplicationFormDetail = {
    ...DEFAULT_APPLICATION_FORM_DETAIL,
    ...options.applicationFormDetail,
  };
  const applicants = options.applicants ?? DEFAULT_APPLICANTS.slice();
  let userAlarms = options.userAlarms ?? DEFAULT_USER_ALARMS.slice();
  let clubAlarms = options.clubAlarms ?? DEFAULT_CLUB_ALARMS.slice();
  const documentFiles = options.documentFiles ?? DEFAULT_DOCUMENT_FILES.slice();
  let mySubmissionDetail = {
    ...DEFAULT_MY_SUBMISSION_DETAIL,
    ...options.mySubmissionDetail,
    contents:
      options.mySubmissionDetail?.contents ??
      DEFAULT_MY_SUBMISSION_DETAIL.contents.map((content) => ({ ...content })),
    availableMajors:
      options.mySubmissionDetail?.availableMajors ??
      DEFAULT_MY_SUBMISSION_DETAIL.availableMajors?.slice(),
  };
  let teachers = options.teachers ?? DEFAULT_TEACHERS.slice();
  const teachersStatus = options.teachersStatus ?? 200;
  let myClubCreationApplication =
    options.myClubCreationApplication === undefined
      ? null
      : options.myClubCreationApplication;
  let myClubCreationApplicationStatus =
    options.myClubCreationApplicationStatus ??
    (myClubCreationApplication ? 200 : 404);

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

  await page.route(/.*\/club-creation-applications\/me$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    recordRequest(route);

    if (myClubCreationApplicationStatus >= 400 || !myClubCreationApplication) {
      await createJsonResponse(
        route,
        createApiErrorResponse(
          "개설 신청 정보를 찾을 수 없습니다.",
          myClubCreationApplicationStatus,
        ),
        myClubCreationApplicationStatus,
      );
      return;
    }

    await createJsonResponse(route, myClubCreationApplication);
  });

  await page.route(/.*\/teachers$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    recordRequest(route);

    if (teachersStatus >= 400) {
      const errorDescription =
        teachersStatus === 403
          ? "이미 동아리 개설 신청을 완료했습니다. 관리자 승인 전까지 새 신청을 진행할 수 없습니다."
          : "지도 교사 목록을 불러오지 못했습니다.";

      await createJsonResponse(
        route,
        createApiErrorResponse(errorDescription, teachersStatus),
        teachersStatus,
      );
      return;
    }

    await createJsonResponse(route, {
      teachers,
    });
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

  await page.route(/.*\/clubs\/applications$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const rawBody = route.request().postData() ?? null;
    const now = "2026-03-18T13:00:00";

    myClubCreationApplication = {
      applicationId: 77,
      status: "SUBMITTED",
      revision: 1,
      clubName: getMultipartFieldValue(rawBody, "clubName") ?? "테스트동아리",
      clubImage: "/images/icons/profile.svg",
      clubCreationForm: "/documents/previews/1.pdf",
      oneLiner:
        getMultipartFieldValue(rawBody, "oneLiner") ?? "같이 성장하는 동아리",
      introduction:
        getMultipartFieldValue(rawBody, "introduction") ??
        "프로젝트와 협업 중심으로 운영하는 테스트 동아리입니다.",
      majors: getMultipartFieldValues(rawBody, "major"),
      links: getMultipartFieldValues(rawBody, "link"),
      applicant: {
        userId: 10,
        userName: user.userName,
        classNumber: user.classNumber,
      },
      submittedAt: now,
      lastSubmittedAt: now,
      currentReviews: [],
      reviewHistory: [],
    };
    myClubCreationApplicationStatus = 200;
    await createJsonResponse(route, { success: true }, 201);
  });

  await page.route(/.*\/club-creation-applications\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);

    if (myClubCreationApplication) {
      myClubCreationApplication = updateApplicationFromMultipart(
        myClubCreationApplication,
        route.request().postData() ?? null,
      );
    }

    await route.fulfill({ status: 204, body: "" });
  });

  await page.route(
    /.*\/club-creation-applications\/\d+\/submit$/,
    async (route) => {
      if (await handleApiFallback(route)) return;
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }

      recordRequest(route);

      if (myClubCreationApplication) {
        const nextRevision = myClubCreationApplication.revision + 1;

        myClubCreationApplication = {
          ...myClubCreationApplication,
          revision: nextRevision,
          status: "UNDER_REVIEW",
          lastSubmittedAt: "2026-03-18T14:00:00",
          currentReviews: [],
          reviewHistory: dedupeReviews([
            ...myClubCreationApplication.reviewHistory,
            ...myClubCreationApplication.currentReviews,
          ]),
        };
      }

      await route.fulfill({ status: 204, body: "" });
    },
  );

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

  await page.route(/.*\/application-forms\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, applicationFormDetail);
  });

  await page.route(/.*\/applications\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    const method = route.request().method();

    if (method === "GET") {
      recordRequest(route);
      await createJsonResponse(route, mySubmissionDetail);
      return;
    }

    if (method === "PATCH") {
      recordRequest(route);
      const payload = parseRequestBody(route).body as {
        introduction?: string;
        major?: string;
        answer?: Array<{
          applicationQuestionId: number;
          answer: string;
        }>;
      } | null;

      mySubmissionDetail = {
        ...mySubmissionDetail,
        introduction: payload?.introduction ?? mySubmissionDetail.introduction,
        major: payload?.major ?? mySubmissionDetail.major,
        contents:
          payload?.answer?.map((item) => {
            const existingContent = mySubmissionDetail.contents.find(
              (content) =>
                content.applicationQuestionId === item.applicationQuestionId,
            );

            return {
              question: existingContent?.question ?? "질문",
              applicationQuestionId: item.applicationQuestionId,
              applicationAnswerId: existingContent?.applicationAnswerId,
              answer: item.answer,
            };
          }) ?? mySubmissionDetail.contents,
      };

      await route.fulfill({ status: 204, body: "" });
      return;
    }

    if (method === "POST") {
      recordRequest(route);
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.continue();
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

  await page.route(/.*\/files$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      fileResponses: documentFiles,
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
    setTeachers: (nextTeachers) => {
      teachers = nextTeachers.slice();
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
