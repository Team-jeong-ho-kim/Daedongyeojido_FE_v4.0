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

import LoginPage from "./page";

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

describe("LoginPage", () => {
  beforeEach(() => {
    Object.values(loginPageMocks).forEach((mock) => {
      mock.mockReset();
    });
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
});
