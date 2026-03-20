import type { UserInfo } from "../types/user";
import { useUserStore } from "./useUserStore";

const createUserInfo = (role: UserInfo["role"]): UserInfo => ({
  classNumber: "2401",
  clubName: "테스트동아리",
  introduction: "소개",
  link: ["https://daedong.test"],
  major: ["FE"],
  phoneNumber: "01012345678",
  profileImage: "https://image.test/profile.png",
  role,
  userName: "홍길동",
});

describe("useUserStore", () => {
  afterEach(() => {
    useUserStore.setState({
      userInfo: null,
    });
  });

  it("stores and clears the current user", () => {
    useUserStore.getState().setUserInfo(createUserInfo("STUDENT"));
    expect(useUserStore.getState().userInfo?.userName).toBe("홍길동");

    useUserStore.getState().clearUser();
    expect(useUserStore.getState().userInfo).toBeNull();
  });

  it("updates only the role when a user is already loaded", () => {
    useUserStore.getState().setUserInfo(createUserInfo("STUDENT"));

    useUserStore.getState().updateRole("CLUB_LEADER");

    expect(useUserStore.getState().userInfo?.role).toBe("CLUB_LEADER");
    expect(useUserStore.getState().isClubLeader()).toBe(true);
    expect(useUserStore.getState().isStudent()).toBe(false);
  });
});
