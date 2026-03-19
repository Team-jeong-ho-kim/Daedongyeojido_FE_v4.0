import type { Page, Route } from "@playwright/test";

type MockDocumentFile = {
  fileId: number;
  fileName: string;
  fileUrl: string;
};

type MockClubCreationApplication = {
  applicationId: number;
  clubName: string;
  clubImage: string | null;
  introduction: string;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REJECTED";
  revision: number;
  majors: string[];
  applicantName: string;
  lastSubmittedAt: string;
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
  currentReviews: Array<{
    reviewId: number;
    reviewerType: "ADMIN" | "TEACHER";
    reviewerName: string;
    revision: number;
    decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
    feedback: string | null;
    updatedAt: string;
  }>;
  reviewHistory: Array<{
    reviewId: number;
    reviewerType: "ADMIN" | "TEACHER";
    reviewerName: string;
    revision: number;
    decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
    feedback: string | null;
    updatedAt: string;
  }>;
};

type MockTeacher = {
  teacherId: number;
  teacherName: string;
};

type RecordedRequest = {
  method: string;
  pathname: string;
};

export type AdminApiMockController = {
  requests: RecordedRequest[];
  getLastRequest: (
    matcher: RegExp | string,
    method?: string,
  ) => RecordedRequest | undefined;
};

type AdminApiMockOptions = {
  documentFiles?: MockDocumentFile[];
  clubCreationApplications?: MockClubCreationApplication[];
  clubCreationApplicationDetails?: Record<
    number,
    MockClubCreationApplicationDetail
  >;
  teachers?: MockTeacher[];
};

const getReviewTimestamp = (
  review:
    | MockClubCreationApplicationDetail["currentReviews"][number]
    | MockClubCreationApplicationDetail["reviewHistory"][number],
) => {
  const timestamp = Date.parse(review.updatedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getLatestReviewsByReviewer = (
  detail: MockClubCreationApplicationDetail,
) => {
  const latestReviewByReviewer = new Map<
    "ADMIN" | "TEACHER",
    MockClubCreationApplicationDetail["currentReviews"][number]
  >();

  for (const review of [...detail.reviewHistory, ...detail.currentReviews]) {
    const currentReview = latestReviewByReviewer.get(review.reviewerType);

    if (!currentReview) {
      latestReviewByReviewer.set(review.reviewerType, review);
      continue;
    }

    if (review.revision !== currentReview.revision) {
      if (review.revision > currentReview.revision) {
        latestReviewByReviewer.set(review.reviewerType, review);
      }
      continue;
    }

    const reviewTimestamp = getReviewTimestamp(review);
    const currentTimestamp = getReviewTimestamp(currentReview);

    if (
      reviewTimestamp > currentTimestamp ||
      (reviewTimestamp === currentTimestamp &&
        review.reviewId > currentReview.reviewId)
    ) {
      latestReviewByReviewer.set(review.reviewerType, review);
    }
  }

  return latestReviewByReviewer;
};

const deriveApplicationStatus = (
  detail: MockClubCreationApplicationDetail,
): MockClubCreationApplicationDetail["status"] => {
  const latestReviewByReviewer = getLatestReviewsByReviewer(detail);

  const hasRejectedReview =
    latestReviewByReviewer.get("ADMIN")?.decision === "REJECTED" ||
    latestReviewByReviewer.get("TEACHER")?.decision === "REJECTED";

  if (hasRejectedReview) {
    return "REJECTED";
  }

  const hasChangesRequestedReview =
    latestReviewByReviewer.get("ADMIN")?.decision === "CHANGES_REQUESTED" ||
    latestReviewByReviewer.get("TEACHER")?.decision === "CHANGES_REQUESTED";

  if (hasChangesRequestedReview) {
    return "CHANGES_REQUESTED";
  }

  const hasAllReviewerApprovals =
    latestReviewByReviewer.get("ADMIN")?.decision === "APPROVED" &&
    latestReviewByReviewer.get("TEACHER")?.decision === "APPROVED";

  if (hasAllReviewerApprovals) {
    return "APPROVED";
  }

  if (detail.currentReviews.length === 0 && detail.reviewHistory.length === 0) {
    return "UNDER_REVIEW";
  }

  return "UNDER_REVIEW";
};

const DEFAULT_DOCUMENT_FILES: MockDocumentFile[] = [
  {
    fileId: 1,
    fileName: "2026 동아리 개설 신청 양식",
    fileUrl: "https://files.test/club-creation-form.hwp",
  },
];

const DEFAULT_CLUB_CREATION_APPLICATIONS: MockClubCreationApplication[] = [
  {
    applicationId: 5,
    clubName: "발로란트",
    clubImage:
      "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
    introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
    status: "UNDER_REVIEW",
    revision: 2,
    majors: ["FE", "BE", "DESIGN"],
    applicantName: "정승우",
    lastSubmittedAt: "2026-03-18T11:00:00",
  },
];

const DEFAULT_CLUB_CREATION_APPLICATION_DETAILS: Record<
  number,
  MockClubCreationApplicationDetail
> = {
  5: {
    applicationId: 5,
    status: "UNDER_REVIEW",
    revision: 2,
    clubName: "발로란트",
    clubImage:
      "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
    clubCreationForm: "/documents/previews/1.pdf",
    oneLiner: "정승우",
    introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
    majors: ["FE", "BE", "DESIGN"],
    links: [
      "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
      "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
      "https://daedongyeojido.site",
    ],
    applicant: {
      userId: 10,
      userName: "정승우",
      classNumber: "3212",
    },
    submittedAt: "2026-03-18T09:00:00",
    lastSubmittedAt: "2026-03-18T11:00:00",
    currentReviews: [
      {
        reviewId: 100,
        reviewerType: "TEACHER",
        reviewerName: "김교사",
        revision: 2,
        decision: "CHANGES_REQUESTED",
        feedback: "활동 계획 보강 필요",
        updatedAt: "2026-03-18T12:00:00",
      },
    ],
    reviewHistory: [
      {
        reviewId: 90,
        reviewerType: "ADMIN",
        reviewerName: "관리자",
        revision: 1,
        decision: "CHANGES_REQUESTED",
        feedback: "세부 계획을 조금 더 보강해주세요.",
        updatedAt: "2026-03-17T17:00:00",
      },
    ],
  },
};

const DEFAULT_TEACHERS: MockTeacher[] = [
  {
    teacherId: 1,
    teacherName: "김현태",
  },
  {
    teacherId: 2,
    teacherName: "박교사",
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

export async function installAdminApiMocks(
  page: Page,
  options: AdminApiMockOptions = {},
): Promise<AdminApiMockController> {
  let documentFiles = options.documentFiles ?? DEFAULT_DOCUMENT_FILES.slice();
  let teachers = options.teachers ?? DEFAULT_TEACHERS.slice();
  const clubCreationApplications =
    options.clubCreationApplications ??
    DEFAULT_CLUB_CREATION_APPLICATIONS.slice();
  const clubCreationApplicationDetails: Record<
    number,
    MockClubCreationApplicationDetail
  > = {
    ...DEFAULT_CLUB_CREATION_APPLICATION_DETAILS,
    ...(options.clubCreationApplicationDetails ?? {}),
  };
  const requests: RecordedRequest[] = [];

  const recordRequest = (route: Route) => {
    const url = new URL(route.request().url());

    requests.push({
      method: route.request().method(),
      pathname: url.pathname,
    });
  };

  const handleApiFallback = async (route: Route) => {
    if (!isApiDataRequest(route)) {
      await route.continue();
      return true;
    }

    return false;
  };

  await page.route(/.*\/files\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "DELETE") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const fileId = Number(route.request().url().split("/").pop());
    documentFiles = documentFiles.filter((file) => file.fileId !== fileId);
    await route.fulfill({ status: 204, body: "" });
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

  await page.route(/.*\/teachers$/, async (route) => {
    if (await handleApiFallback(route)) return;

    if (route.request().method() === "GET") {
      recordRequest(route);
      await createJsonResponse(route, { teachers });
      return;
    }

    await route.continue();
  });

  await page.route(/.*\/admin\/teachers$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const requestBody = route.request().postDataJSON() as {
      teacherName?: string;
    };

    teachers = [
      ...teachers,
      {
        teacherId:
          teachers.length > 0
            ? Math.max(...teachers.map((teacher) => teacher.teacherId)) + 1
            : 1,
        teacherName: requestBody.teacherName ?? "새 지도 교사",
      },
    ];

    await route.fulfill({ status: 201, body: "" });
  });

  await page.route(/.*\/result-duration$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      resultDuration: "2026-03-31",
      resultDurationId: 1,
    });
  });

  await page.route(/.*\/club-creation-applications$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    recordRequest(route);
    await createJsonResponse(route, {
      applications: clubCreationApplications,
    });
  });

  await page.route(/.*\/club-creation-applications\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    recordRequest(route);
    const applicationId = Number(route.request().url().split("/").pop());
    const detail = clubCreationApplicationDetails[applicationId];

    if (!detail) {
      await createJsonResponse(
        route,
        { message: "개설 신청 상세 정보를 찾을 수 없습니다." },
        404,
      );
      return;
    }

    await createJsonResponse(route, detail);
  });

  await page.route(
    /.*\/club-creation-applications\/\d+\/review$/,
    async (route) => {
      if (await handleApiFallback(route)) return;
      if (route.request().method() !== "PUT") {
        await route.continue();
        return;
      }

      recordRequest(route);
      const requestBody = route.request().postDataJSON() as {
        decision?: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
        feedback?: string;
      };
      const applicationId = Number(
        route.request().url().split("/").slice(-2)[0],
      );
      const detail = clubCreationApplicationDetails[applicationId];

      if (detail && requestBody.decision) {
        const nextReview = {
          reviewId:
            detail.currentReviews.find(
              (review) => review.reviewerType === "ADMIN",
            )?.reviewId ?? 999,
          reviewerType: "ADMIN" as const,
          reviewerName: "관리자",
          revision: detail.revision,
          decision: requestBody.decision,
          feedback: requestBody.feedback ?? null,
          updatedAt: "2026-03-18T13:30:00",
        };

        detail.currentReviews = [
          ...detail.currentReviews.filter(
            (review) =>
              !(
                review.reviewerType === "ADMIN" &&
                review.revision === detail.revision
              ),
          ),
          nextReview,
        ];
        detail.status = deriveApplicationStatus(detail);

        const listItem = clubCreationApplications.find(
          (application) => application.applicationId === applicationId,
        );

        if (listItem) {
          listItem.status = detail.status;
          listItem.lastSubmittedAt =
            detail.lastSubmittedAt ?? listItem.lastSubmittedAt;
        }
      }

      await route.fulfill({ status: 204, body: "" });
    },
  );

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

export async function setAdminAuthSession(
  page: Page,
  options?: {
    userName?: string;
  },
) {
  const userName = options?.userName ?? "관리자";
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3002";

  await page.context().addCookies([
    {
      name: "access_token",
      value: "mock-access-token",
      url: baseURL,
    },
    {
      name: "refresh_token",
      value: "mock-refresh-token",
      url: baseURL,
    },
    {
      name: "auth_role",
      value: "ADMIN",
      url: baseURL,
    },
    {
      name: "auth_user_name",
      value: userName,
      url: baseURL,
    },
  ]);

  await page.addInitScript(
    ({ injectedUserName }) => {
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = "access_token=mock-access-token; path=/";
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = "refresh_token=mock-refresh-token; path=/";
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = "auth_role=ADMIN; path=/";
      // biome-ignore lint/suspicious/noDocumentCookie: e2e 인증 상태를 빠르게 주입한다.
      document.cookie = `auth_user_name=${encodeURIComponent(injectedUserName)}; path=/`;
    },
    {
      injectedUserName: userName,
    },
  );
}
