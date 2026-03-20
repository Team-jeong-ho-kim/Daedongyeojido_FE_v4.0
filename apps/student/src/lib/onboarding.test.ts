import type { UserInfo } from "shared";
import { isOnboardingRequired } from "./onboarding";

const createUser = (overrides: Partial<UserInfo> = {}): UserInfo => ({
  classNumber: "2401",
  clubName: "테스트동아리",
  introduction: "안녕하세요",
  link: ["https://daedong.test"],
  major: ["FE"],
  profileImage: "https://image.test/profile.png",
  role: "STUDENT",
  userName: "홍길동",
  ...overrides,
});

describe("isOnboardingRequired", () => {
  it("returns false for complete profiles", () => {
    expect(isOnboardingRequired(createUser())).toBe(false);
  });

  it("returns true when required fields are empty", () => {
    expect(
      isOnboardingRequired(
        createUser({
          introduction: " ",
          link: [""],
          major: [],
          profileImage: null,
        }),
      ),
    ).toBe(true);
  });

  it("returns false for missing users", () => {
    expect(isOnboardingRequired(null)).toBe(false);
  });
});
