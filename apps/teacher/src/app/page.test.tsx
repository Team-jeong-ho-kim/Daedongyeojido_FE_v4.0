const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import TeacherHomePage from "./page";

describe("TeacherHomePage", () => {
  it("redirects to the mypage route", () => {
    TeacherHomePage();
    expect(redirectMock).toHaveBeenCalledWith("/mypage");
  });
});
