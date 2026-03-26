const authCookieMocks = vi.hoisted(() => {
  const store = new Map<string, string>();

  return {
    get: vi.fn((key: string) => store.get(key)),
    remove: vi.fn((key: string) => {
      store.delete(key);
    }),
    reset: () => {
      store.clear();
      authCookieMocks.get.mockClear();
      authCookieMocks.remove.mockClear();
      authCookieMocks.set.mockClear();
    },
    set: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };
});

vi.mock("react-cookie", () => ({
  Cookies: vi.fn(() => ({
    get: authCookieMocks.get,
    remove: authCookieMocks.remove,
    set: authCookieMocks.set,
  })),
}));

describe("auth-cookie helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    authCookieMocks.reset();
  });

  it("saves tokens with cross-subdomain cookie options on https hosts", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("https://student.daedongyeojido.site/mypage"),
    });

    const { saveTokens } = await import("../auth-cookie");

    saveTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(authCookieMocks.set).toHaveBeenCalledWith(
      "access_token",
      "access-token",
      expect.objectContaining({
        domain: ".daedongyeojido.site",
        sameSite: "none",
        secure: true,
      }),
    );
    expect(authCookieMocks.set).toHaveBeenCalledWith(
      "refresh_token",
      "refresh-token",
      expect.objectContaining({
        domain: ".daedongyeojido.site",
      }),
    );
  });

  it("reads and clears the session user", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("http://localhost:3001/mypage"),
    });

    const { clearTokens, getSessionUser, saveSessionUser } = await import(
      "../auth-cookie"
    );

    saveSessionUser({
      accessToken: "access-token",
      classNumber: "2401",
      refreshToken: "refresh-token",
      role: "TEACHER",
      userName: "김교사",
    });

    expect(getSessionUser()).toEqual({
      role: "TEACHER",
      userName: "김교사",
    });

    clearTokens();

    expect(authCookieMocks.remove).toHaveBeenCalledWith(
      "access_token",
      expect.objectContaining({
        path: "/",
      }),
    );
    expect(getSessionUser()).toBeNull();
  });
});
