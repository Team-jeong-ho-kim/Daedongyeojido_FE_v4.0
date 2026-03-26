import { act, render, waitFor } from "@testing-library/react";
import { UserProvider } from "../UserProvider";

const providerMocks = vi.hoisted(() => {
  const useUserStore = vi.fn();
  Object.assign(useUserStore, {
    getState: vi.fn(),
  });

  return {
    clearTokens: vi.fn(),
    clearUser: vi.fn(),
    getAccessToken: vi.fn(),
    getSessionUser: vi.fn(),
    useMyInfoQuery: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    useUserStore,
  };
});

vi.mock("next/navigation", () => ({
  usePathname: providerMocks.usePathname,
  useRouter: providerMocks.useRouter,
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    useUserStore: providerMocks.useUserStore,
  };
});

vi.mock("utils", () => ({
  clearTokens: providerMocks.clearTokens,
  getAccessToken: providerMocks.getAccessToken,
  getSessionUser: providerMocks.getSessionUser,
}));

vi.mock("@/hooks/querys", () => ({
  useMyInfoQuery: providerMocks.useMyInfoQuery,
}));

const mockedUseUserStore = providerMocks.useUserStore as typeof providerMocks.useUserStore & {
  getState: ReturnType<typeof vi.fn>;
};

describe("UserProvider", () => {
  let currentPathname = "/mypage";

  beforeEach(() => {
    providerMocks.clearTokens.mockReset();
    providerMocks.clearUser.mockReset();
    providerMocks.getAccessToken.mockReset();
    providerMocks.getSessionUser.mockReset();
    providerMocks.useMyInfoQuery.mockReset();
    providerMocks.usePathname.mockReset();
    providerMocks.useRouter.mockReset();
    providerMocks.useUserStore.mockReset();
    mockedUseUserStore.getState.mockReset();

    currentPathname = "/mypage";
    providerMocks.usePathname.mockImplementation(() => currentPathname);
    providerMocks.useRouter.mockReturnValue({
      replace: vi.fn(),
    });
    mockedUseUserStore.getState.mockReturnValue({
      clearUser: providerMocks.clearUser,
    });
    providerMocks.useMyInfoQuery.mockReturnValue({
      data: null,
      isPending: false,
    });
    providerMocks.getAccessToken.mockReturnValue("access-token");
    providerMocks.getSessionUser.mockReturnValue({
      role: "STUDENT",
      userName: "홍길동",
    });
    vi.stubEnv("NEXT_PUBLIC_WEB_URL", "https://web.example.com");
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("https://student.example.com/mypage"),
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps the current session when access token and session user both exist", async () => {
    render(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.useMyInfoQuery).toHaveBeenCalledWith({
        enabled: true,
      });
    });

    expect(providerMocks.clearTokens).not.toHaveBeenCalled();
    expect(providerMocks.clearUser).not.toHaveBeenCalled();
    expect(window.location.href).toBe("https://student.example.com/mypage");
  });

  it("clears the session and redirects on mount when the access token is missing", async () => {
    providerMocks.getAccessToken.mockReturnValue(null);

    render(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.clearTokens).toHaveBeenCalledTimes(1);
    });

    expect(providerMocks.clearUser).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("https://web.example.com/login");
  });

  it("clears the session and redirects on mount when the session user is missing", async () => {
    providerMocks.getSessionUser.mockReturnValue(null);

    render(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.clearTokens).toHaveBeenCalledTimes(1);
    });

    expect(providerMocks.clearUser).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("https://web.example.com/login");
  });

  it("revalidates the session on window focus", async () => {
    render(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.useMyInfoQuery).toHaveBeenCalledWith({
        enabled: true,
      });
    });

    providerMocks.getAccessToken.mockReturnValue(null);

    act(() => {
      window.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => {
      expect(providerMocks.clearTokens).toHaveBeenCalledTimes(1);
    });

    expect(providerMocks.clearUser).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("https://web.example.com/login");
  });

  it("revalidates the session when pathname changes", async () => {
    const { rerender } = render(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.useMyInfoQuery).toHaveBeenCalledWith({
        enabled: true,
      });
    });

    providerMocks.getAccessToken.mockReturnValue(null);
    currentPathname = "/mypage/applications";

    rerender(
      <UserProvider>
        <div>child</div>
      </UserProvider>,
    );

    await waitFor(() => {
      expect(providerMocks.clearTokens).toHaveBeenCalledTimes(1);
    });

    expect(providerMocks.clearUser).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("https://web.example.com/login");
  });
});
