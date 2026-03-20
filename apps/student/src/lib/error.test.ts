import { ApiError } from "utils";
import { getErrorMessage } from "./error";

describe("student getErrorMessage", () => {
  it("returns the ApiError description for api errors", () => {
    expect(
      getErrorMessage(
        new ApiError(
          "실패했습니다.",
          400,
          "2026-03-21T00:00:00",
          "Bad Request",
        ),
        "기본 메시지",
      ),
    ).toBe("실패했습니다.");
  });

  it("falls back for non api errors", () => {
    expect(getErrorMessage(new Error("boom"), "기본 메시지")).toBe(
      "기본 메시지",
    );
  });
});
