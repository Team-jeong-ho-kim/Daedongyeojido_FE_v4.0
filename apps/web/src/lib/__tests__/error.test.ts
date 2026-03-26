import { ApiError } from "utils";
import { getErrorMessage } from "../error";

describe("web getErrorMessage", () => {
  it("returns the ApiError description for api errors", () => {
    expect(
      getErrorMessage(
        new ApiError("로그인 실패", 400, "2026-03-21T00:00:00", "Bad Request"),
        "기본 메시지",
      ),
    ).toBe("로그인 실패");
  });

  it("returns the fallback for unknown errors", () => {
    expect(getErrorMessage(new Error("boom"), "기본 메시지")).toBe(
      "기본 메시지",
    );
  });
});
