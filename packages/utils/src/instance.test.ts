import type { ApiError } from "./types/error";

const instanceMocks = vi.hoisted(() => {
  const requestHandlers: Array<(config: any) => any> = [];
  const responseRejectedHandlers: Array<(error: any) => any> = [];
  const client = vi.fn();
  client.interceptors = {
    request: {
      use: (fulfilled: (config: any) => any) => {
        requestHandlers.push(fulfilled);
        return 0;
      },
    },
    response: {
      use: (_fulfilled: (value: any) => any, rejected: (error: any) => any) => {
        responseRejectedHandlers.push(rejected);
        return 0;
      },
    },
  };

  return {
    clearTokens: vi.fn(),
    client,
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    patch: vi.fn(),
    requestHandlers,
    reset: () => {
      instanceMocks.clearTokens.mockReset();
      instanceMocks.client.mockReset();
      instanceMocks.getAccessToken.mockReset();
      instanceMocks.getRefreshToken.mockReset();
      instanceMocks.patch.mockReset();
      instanceMocks.requestHandlers.length = 0;
      instanceMocks.responseRejectedHandlers.length = 0;
      instanceMocks.saveTokens.mockReset();
    },
    responseRejectedHandlers,
    saveTokens: vi.fn(),
  };
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => instanceMocks.client),
    isAxiosError: (error: unknown) =>
      Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
    patch: instanceMocks.patch,
  },
}));

vi.mock("./auth", () => ({
  clearTokens: instanceMocks.clearTokens,
  getAccessToken: instanceMocks.getAccessToken,
  getRefreshToken: instanceMocks.getRefreshToken,
  saveTokens: instanceMocks.saveTokens,
}));

vi.mock("./env", () => ({
  BASE_URL: "https://api.test",
}));

describe("apiClient interceptors", () => {
  beforeEach(() => {
    vi.resetModules();
    instanceMocks.reset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("https://dsm.daedongyeojido.site/login"),
    });
  });

  it("adds bearer tokens and removes multipart content type", async () => {
    instanceMocks.getAccessToken.mockReturnValue("access-token");

    await import("./instance");

    const config = instanceMocks.requestHandlers[0]?.({
      data: new FormData(),
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(config.headers.Authorization).toBe("Bearer access-token");
    expect(config.headers["Content-Type"]).toBeUndefined();
  });

  it("reissues tokens on 401 and retries the original request", async () => {
    instanceMocks.getRefreshToken.mockReturnValue("refresh-token");
    instanceMocks.patch.mockResolvedValue({
      data: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      },
    });
    instanceMocks.client.mockResolvedValue({
      data: {
        ok: true,
      },
    });

    await import("./instance");

    const result = await instanceMocks.responseRejectedHandlers[0]?.({
      config: {
        headers: {},
        url: "/clubs",
      },
      response: {
        status: 401,
      },
    });

    expect(instanceMocks.patch).toHaveBeenCalledWith(
      "https://api.test/auth/reissue",
      {},
      {
        headers: {
          "X-Refresh-Token": "refresh-token",
        },
        withCredentials: true,
      },
    );
    expect(instanceMocks.saveTokens).toHaveBeenCalledWith({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    expect(instanceMocks.client).toHaveBeenCalledWith(
      expect.objectContaining({
        _retry: true,
        headers: expect.objectContaining({
          Authorization: "Bearer new-access-token",
        }),
      }),
    );
    expect(result).toEqual({
      data: {
        ok: true,
      },
    });
  });

  it("converts api errors when login-related requests bypass the reissue flow", async () => {
    await import("./instance");

    await expect(
      instanceMocks.responseRejectedHandlers[0]?.({
        config: {
          url: "/auth/login",
        },
        isAxiosError: true,
        response: {
          data: {
            description: "로그인 실패",
            message: "Bad Request",
            status: 400,
            timestamp: "2026-03-21T00:00:00",
          },
        },
      }),
    ).rejects.toMatchObject<ApiError>({
      description: "로그인 실패",
      name: "ApiError",
      status: 400,
    });
  });
});
