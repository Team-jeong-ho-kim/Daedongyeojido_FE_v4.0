import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/image", () => ({
  default: ({
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
  }) => (
    // biome-ignore lint/performance/noImgElement: next/image is replaced with a plain element in tests.
    <img alt={props.alt ?? ""} {...props} />
  ),
}));

const loginPageMocks = vi.hoisted(() => ({
  apiPost: vi.fn(),
  saveSessionUser: vi.fn(),
  saveTokens: vi.fn(),
}));

vi.mock("utils", async () => {
  const actual = await vi.importActual<object>("utils");

  return {
    ...actual,
    apiClient: {
      post: loginPageMocks.apiPost,
    },
    saveSessionUser: loginPageMocks.saveSessionUser,
    saveTokens: loginPageMocks.saveTokens,
  };
});

import { ApiError } from "utils";
import LoginPage from "./page";

const defaultPublicUrls = {
  NEXT_PUBLIC_USER_URL: "http://localhost:3001",
  NEXT_PUBLIC_ADMIN_URL: "http://localhost:3002",
  NEXT_PUBLIC_TEACHER_URL: "http://localhost:3003",
} as const;

describe("LoginPage", () => {
  beforeEach(() => {
    Object.values(loginPageMocks).forEach((mock) => {
      mock.mockReset();
    });
    process.env.NEXT_PUBLIC_USER_URL = defaultPublicUrls.NEXT_PUBLIC_USER_URL;
    process.env.NEXT_PUBLIC_ADMIN_URL = defaultPublicUrls.NEXT_PUBLIC_ADMIN_URL;
    process.env.NEXT_PUBLIC_TEACHER_URL =
      defaultPublicUrls.NEXT_PUBLIC_TEACHER_URL;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("http://localhost/login"),
    });
  });

  it("shows a validation message when credentials are missing", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      screen.getByText("계정과 비밀번호를 모두 입력해주세요."),
    ).toBeVisible();
  });

  it("logs in teachers and redirects to the teacher app", async () => {
    const user = userEvent.setup();

    loginPageMocks.apiPost.mockResolvedValueOnce({
      data: {
        accessToken: "access",
        classNumber: "0000",
        refreshToken: "refresh",
        role: "TEACHER",
        userName: "김교사",
      },
    });

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "선생님 로그인" }));
    await user.type(screen.getByLabelText("교사용 계정 ID"), "teacher-account");
    await user.type(screen.getByLabelText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(loginPageMocks.apiPost).toHaveBeenCalledWith("/auth/login", {
        accountId: "teacher-account",
        division: "TEACHER",
        password: "password",
      });
    });

    expect(loginPageMocks.saveTokens).toHaveBeenCalled();
    expect(loginPageMocks.saveSessionUser).toHaveBeenCalled();
    expect(window.location.href).toBe("http://localhost:3003/mypage");
  });

  it("redirects admins to the stage admin app on staged hosts", async () => {
    const user = userEvent.setup();

    process.env.NEXT_PUBLIC_ADMIN_URL =
      "https://admin-stag.daedongyeojido.site";

    loginPageMocks.apiPost.mockResolvedValueOnce({
      data: {
        accessToken: "access",
        classNumber: "0000",
        refreshToken: "refresh",
        role: "ADMIN",
        userName: "관리자",
      },
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText("DSM 계정 ID"), "admin-account");
    await user.type(screen.getByLabelText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(loginPageMocks.apiPost).toHaveBeenCalledWith("/auth/login", {
        accountId: "admin-account",
        division: "STUDENT",
        password: "password",
      });
    });

    expect(window.location.href).toBe(
      "https://admin-stag.daedongyeojido.site/",
    );
  });

  it("shows ApiError descriptions when login fails", async () => {
    const user = userEvent.setup();

    loginPageMocks.apiPost.mockRejectedValueOnce(
      new ApiError(
        "계정 정보를 다시 확인해주세요.",
        400,
        "2026-03-21T00:00:00",
        "Bad Request",
      ),
    );

    render(<LoginPage />);

    await user.type(screen.getByLabelText("DSM 계정 ID"), "student-account");
    await user.type(screen.getByLabelText("비밀번호"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("계정 정보를 다시 확인해주세요."),
    ).toBeVisible();
  });

  it("fails fast when a required public url is missing", () => {
    process.env.NEXT_PUBLIC_USER_URL = "";

    expect(() => render(<LoginPage />)).toThrow(
      "NEXT_PUBLIC_USER_URL is required",
    );
  });
});
