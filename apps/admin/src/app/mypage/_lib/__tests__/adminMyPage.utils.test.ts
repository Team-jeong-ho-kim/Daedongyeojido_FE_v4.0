import { ApiError } from "utils";
import {
  toDateText,
  toErrorMessage,
  toResultDurationDateTime,
} from "../adminMyPage.utils";

describe("admin mypage utils", () => {
  it("formats tuple dates and leaves strings untouched", () => {
    expect(toDateText([2026, 3, 9])).toBe("2026-03-09");
    expect(toDateText("2026-03-09")).toBe("2026-03-09");
    expect(toDateText(undefined)).toBe("-");
  });

  it("normalizes result duration datetimes", () => {
    expect(toResultDurationDateTime("2026-03-21")).toBe("2026-03-21T00:00:00");
    expect(toResultDurationDateTime("2026-03-21T12:30")).toBe(
      "2026-03-21T12:30:00",
    );
    expect(toResultDurationDateTime("2026-03-21T12:30:45")).toBe(
      "2026-03-21T12:30:45",
    );
  });

  it("reuses the shared error formatter", () => {
    expect(
      toErrorMessage(
        new ApiError("실패", 400, "2026-03-21T00:00:00", "Bad Request"),
        "기본",
      ),
    ).toBe("실패");
  });
});
