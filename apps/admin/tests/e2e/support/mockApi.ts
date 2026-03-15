import type { Page, Route } from "@playwright/test";

type MockDocumentFile = {
  fileId: number;
  fileName: string;
  fileUrl: string;
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
};

const DEFAULT_DOCUMENT_FILES: MockDocumentFile[] = [
  {
    fileId: 1,
    fileName: "2026 동아리 개설 신청 양식",
    fileUrl: "https://files.test/club-creation-form.hwp",
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
