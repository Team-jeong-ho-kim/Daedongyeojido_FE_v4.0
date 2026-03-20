import type { Page, Route } from "@playwright/test";

type MockTeacherMyInfo = {
  accountId: string;
  clubId: number | null;
  clubName: string | null;
  teacherName: string;
};

type MockTeacherApplication = {
  applicantName: string;
  applicationId: number;
  clubImage: string | null;
  clubName: string;
  introduction: string;
  lastSubmittedAt: string;
  majors: string[];
  revision: number;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REJECTED";
};

type MockTeacherApplicationDetail = {
  applicant: {
    classNumber: string;
    userId: number;
    userName: string;
  };
  applicationId: number;
  clubCreationForm: string | null;
  clubImage: string | null;
  clubName: string;
  currentReviews: Array<{
    decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
    feedback: string | null;
    reviewId: number;
    reviewerName: string;
    reviewerType: "ADMIN" | "TEACHER";
    revision: number;
    updatedAt: string;
  }>;
  introduction: string;
  lastSubmittedAt: string | null;
  links: string[];
  majors: string[];
  oneLiner: string;
  reviewHistory: Array<{
    decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
    feedback: string | null;
    reviewId: number;
    reviewerName: string;
    reviewerType: "ADMIN" | "TEACHER";
    revision: number;
    updatedAt: string;
  }>;
  revision: number;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REJECTED";
  submittedAt: string | null;
};

type MockTeacherApiOptions = {
  applicationDetails?: Record<number, MockTeacherApplicationDetail>;
  applications?: MockTeacherApplication[];
  myInfo?: MockTeacherMyInfo;
};

const DEFAULT_MY_INFO: MockTeacherMyInfo = {
  accountId: "teacher01",
  clubId: 7,
  clubName: "테스트동아리",
  teacherName: "김교사",
};

const DEFAULT_APPLICATIONS: MockTeacherApplication[] = [
  {
    applicantName: "홍길동",
    applicationId: 7,
    clubImage: null,
    clubName: "테스트동아리",
    introduction: "전략과 협업 중심으로 운영하는 동아리입니다.",
    lastSubmittedAt: "2026-03-21T10:00:00",
    majors: ["FE", "BE"],
    revision: 2,
    status: "UNDER_REVIEW",
  },
];

const DEFAULT_APPLICATION_DETAILS: Record<
  number,
  MockTeacherApplicationDetail
> = {
  7: {
    applicant: {
      classNumber: "2401",
      userId: 1,
      userName: "홍길동",
    },
    applicationId: 7,
    clubCreationForm: null,
    clubImage: null,
    clubName: "테스트동아리",
    currentReviews: [],
    introduction: "전략과 협업 중심으로 운영하는 동아리입니다.",
    lastSubmittedAt: "2026-03-21T10:00:00",
    links: ["https://daedong.test"],
    majors: ["FE", "BE"],
    oneLiner: "함께 성장하는 동아리",
    reviewHistory: [],
    revision: 2,
    status: "UNDER_REVIEW",
    submittedAt: "2026-03-21T09:00:00",
  },
};

const json = (route: Route, body: unknown) =>
  route.fulfill({
    body: JSON.stringify(body),
    contentType: "application/json",
    status: 200,
  });

export const setTeacherAuthSession = async (page: Page) => {
  await page.context().addCookies([
    {
      name: "access_token",
      path: "/",
      url: "http://localhost:3003",
      value: "teacher-access-token",
    },
    {
      name: "auth_role",
      path: "/",
      url: "http://localhost:3003",
      value: "TEACHER",
    },
    {
      name: "auth_user_name",
      path: "/",
      url: "http://localhost:3003",
      value: "김교사",
    },
  ]);
};

export const installTeacherApiMocks = async (
  page: Page,
  options: MockTeacherApiOptions = {},
) => {
  const myInfo = options.myInfo ?? DEFAULT_MY_INFO;
  const applications = options.applications ?? DEFAULT_APPLICATIONS;
  const applicationDetails =
    options.applicationDetails ?? DEFAULT_APPLICATION_DETAILS;

  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    const pathname = requestUrl.pathname;

    if (pathname.endsWith("/teachers/my-info")) {
      return json(route, myInfo);
    }

    if (
      pathname.endsWith("/club-creation-applications") &&
      route.request().method() === "GET"
    ) {
      return json(route, { applications });
    }

    const match = pathname.match(/\/club-creation-applications\/(\d+)$/);
    if (match) {
      const detail = applicationDetails[Number(match[1])];
      return json(route, detail);
    }

    return route.continue();
  });
};
