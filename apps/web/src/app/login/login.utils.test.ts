import { ApiError } from "utils";
import { resolveServiceUrl, toLoginErrorMessage } from "./login.utils";

describe("login utils", () => {
  it("prefers normalized env urls", () => {
    expect(resolveServiceUrl("https://admin.example.com/", "admin")).toBe(
      "https://admin.example.com",
    );
  });

  it("builds hosted service urls from the current domain", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("https://dsm.daedongyeojido.site/login"),
    });

    expect(resolveServiceUrl(undefined, "teacher")).toBe(
      "https://teacher.daedongyeojido.site",
    );
  });

  it("falls back to localhost urls during local development", () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("http://localhost/login"),
    });

    expect(resolveServiceUrl(undefined, "student")).toBe(
      "http://localhost:3001",
    );
  });

  it("uses ApiError descriptions when available", () => {
    expect(
      toLoginErrorMessage(
        new ApiError("로그인 실패", 400, "2026-03-21T00:00:00", "Bad Request"),
        "기본",
      ),
    ).toBe("로그인 실패");
  });
});
