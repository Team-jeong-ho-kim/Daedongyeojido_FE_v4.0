import { describe, expect, it } from "vitest";
import { canEditInterviewScheduleForRole } from "../page";

describe("SubmissionDetailPage interview schedule permissions", () => {
  it("allows club members to edit interview schedules", () => {
    expect(canEditInterviewScheduleForRole("CLUB_MEMBER")).toBe(true);
  });

  it("keeps interview schedule edit permission for club leaders", () => {
    expect(canEditInterviewScheduleForRole("CLUB_LEADER")).toBe(true);
  });

  it("does not allow non-club roles to edit interview schedules", () => {
    expect(canEditInterviewScheduleForRole("STUDENT")).toBe(false);
    expect(canEditInterviewScheduleForRole("ADMIN")).toBe(false);
    expect(canEditInterviewScheduleForRole("TEACHER")).toBe(false);
    expect(canEditInterviewScheduleForRole(undefined)).toBe(false);
  });
});
