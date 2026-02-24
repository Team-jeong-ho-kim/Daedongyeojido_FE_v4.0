import type { Page, Route } from "@playwright/test";

function isApiDataRequest(route: Route) {
  const resourceType = route.request().resourceType();
  return resourceType === "fetch" || resourceType === "xhr";
}

const mockUser = {
  classNumber: "2301",
  userName: "테스트유저",
  profileImage: "/images/icons/profile.svg",
  clubName: "테스트동아리",
  major: ["BACKEND"],
  introduction: "안녕하세요",
  link: ["https://example.com"],
  role: "STUDENT",
};

const mockAnnouncements = {
  announcements: [
    {
      announcementId: 1,
      title: "백엔드 모집",
      clubName: "테스트동아리",
      deadline: "2026-12-31",
      clubImage: "/images/icons/profile.svg",
      status: "OPEN",
      applicationFormId: 11,
    },
  ],
};

const mockAnnouncementDetail = {
  clubId: 1,
  title: "백엔드 모집",
  major: ["BACKEND"],
  phoneNumber: "01012341234",
  deadline: "2026-12-31",
  introduction: "동아리 소개",
  talentDescription: "열정 있는 학생",
  assignment: "간단 과제",
  status: "OPEN",
  applicationFormId: 11,
};

const mockClubs = {
  clubs: [
    {
      clubId: 1,
      clubName: "테스트동아리",
      clubImage: "/images/icons/profile.svg",
      introduction: "테스트 소개",
      majors: ["BACKEND"],
    },
  ],
};

const mockClubDetail = {
  club: {
    clubName: "테스트동아리",
    introduction: "테스트 소개",
    oneLiner: "한 줄 소개",
    clubImage: "/images/icons/profile.svg",
    majors: ["BACKEND"],
    links: ["https://example.com"],
  },
  clubMembers: [
    {
      userId: 1,
      userName: "홍길동",
      majors: ["BACKEND"],
      introduction: "멤버 소개",
      profileImage: "/images/icons/profile.svg",
    },
  ],
};

export async function installStudentApiMocks(page: Page) {
  await page.route("**/users", async (route) => {
    if (route.request().method() !== "GET" || !isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUser),
    });
  });

  await page.route("**/announcements", async (route) => {
    if (route.request().method() !== "GET" || !isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockAnnouncements),
    });
  });

  await page.route(/.*\/announcements\/\d+$/, async (route) => {
    if (route.request().method() !== "GET" || !isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockAnnouncementDetail),
    });
  });

  await page.route("**/clubs", async (route) => {
    if (route.request().method() !== "GET" || !isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockClubs),
    });
  });

  await page.route(/.*\/clubs\/\d+$/, async (route) => {
    if (route.request().method() !== "GET" || !isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockClubDetail),
    });
  });

  await page.route(/.*\/application-forms\/clubs\/\d+$/, async (route) => {
    if (!isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ applicationForms: [] }),
    });
  });

  await page.route("**/alarms/clubs", async (route) => {
    if (!isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ alarms: [] }),
    });
  });

  await page.route(/.*\/clubs\/submissions\/all\/\d+$/, async (route) => {
    if (!isApiDataRequest(route)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ applicants: [] }),
    });
  });
}

export async function setAuthSession(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("access_token", "mock-access-token");
    window.sessionStorage.setItem("refresh_token", "mock-refresh-token");
  });
}
