import type { Page, Route } from "@playwright/test";

type MockDocumentFile = {
  fileId: number;
  fileName: string;
  fileUrl: string;
};

type MockClubCreationApplication = {
  clubId: number;
  clubName: string;
  clubImage: string;
  introduction: string;
  majors: string[];
};

type MockClubCreationApplicationDetail = {
  club: {
    clubName: string;
    introduction: string;
    oneLiner: string;
    clubImage: string;
    majors: string[];
    links: string[];
  };
  userName: string;
  classNumber: string;
  clubCreationForm: string;
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

const DEFAULT_DOCUMENT_FILES: MockDocumentFile[] = [
  {
    fileId: 1,
    fileName: "2026 동아리 개설 신청 양식",
    fileUrl: "https://files.test/club-creation-form.hwp",
  },
];

const DEFAULT_CLUB_CREATION_APPLICATIONS: MockClubCreationApplication[] = [
  {
    clubId: 5,
    clubName: "발로란트",
    clubImage:
      "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
    introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
    majors: ["FE", "BE", "DESIGN"],
  },
];

const DEFAULT_CLUB_CREATION_APPLICATION_DETAILS: Record<
  number,
  MockClubCreationApplicationDetail
> = {
  5: {
    club: {
      clubName: "발로란트",
      introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
      oneLiner: "정승우",
      clubImage:
        "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
      majors: ["FE", "BE", "DESIGN"],
      links: [
        "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
        "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
        "https://daedongyeojido.site",
      ],
    },
    userName: "정승우",
    classNumber: "3212",
    clubCreationForm: "/documents/previews/1.pdf",
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
  const clubCreationApplicationDetails = {
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

    if (route.request().method() === "POST") {
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
      return;
    }

    await route.continue();
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

  await page.route(/.*\/admin\/club-creation-application$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await createJsonResponse(route, {
      clubs: clubCreationApplications,
    });
  });

  await page.route(
    /.*\/admin\/club-creation-application\/\d+$/,
    async (route) => {
      if (await handleApiFallback(route)) return;
      if (route.request().method() !== "GET") {
        await route.continue();
        return;
      }

      recordRequest(route);
      const clubId = Number(route.request().url().split("/").pop());
      const detail = clubCreationApplicationDetails[clubId];

      if (!detail) {
        await createJsonResponse(
          route,
          { message: "개설 신청 상세 정보를 찾을 수 없습니다." },
          404,
        );
        return;
      }

      await createJsonResponse(route, detail);
    },
  );

  await page.route(/.*\/admin\/clubs\/applications\/\d+$/, async (route) => {
    if (await handleApiFallback(route)) return;
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    recordRequest(route);
    await route.fulfill({ status: 204, body: "" });
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
