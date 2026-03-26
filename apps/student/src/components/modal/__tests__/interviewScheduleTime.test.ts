import { describe, expect, it } from "vitest";
import {
  buildInterviewSchedulePayload,
  formatInterviewTimeForDisplay,
  parseInterviewScheduleFormValues,
} from "../interviewScheduleTime";

describe("interviewScheduleTime", () => {
  it("formats interview time with hour and minute for display", () => {
    expect(formatInterviewTimeForDisplay("12:30:00")).toBe("오후 12시 30분");
    expect(formatInterviewTimeForDisplay("00:05:00")).toBe("오전 12시 05분");
    expect(formatInterviewTimeForDisplay("09:00:00")).toBe("오전 9시 00분");
    expect(formatInterviewTimeForDisplay("13:07:59")).toBe("오후 1시 07분");
  });

  it("keeps parsing interview schedule form values for edit mode", () => {
    expect(parseInterviewScheduleFormValues("2026-05-01", "12:30:00")).toEqual({
      year: "2026",
      month: "05",
      day: "01",
      period: "오후",
      hour: "12",
      minute: "30",
    });

    expect(parseInterviewScheduleFormValues("2026-05-01", "00:05:00")).toEqual({
      year: "2026",
      month: "05",
      day: "01",
      period: "오전",
      hour: "12",
      minute: "05",
    });
  });

  it("builds the submit payload with zero-padded 24-hour time", () => {
    expect(
      buildInterviewSchedulePayload({
        year: "2026",
        month: "5",
        day: "1",
        period: "오후",
        hour: "1",
        minute: "7",
      }),
    ).toEqual({
      interviewSchedule: "2026-05-01",
      interviewTime: "13:07",
    });
  });
});
