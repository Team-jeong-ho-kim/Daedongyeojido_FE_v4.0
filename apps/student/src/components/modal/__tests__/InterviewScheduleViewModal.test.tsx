import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterviewScheduleViewModal } from "../InterviewScheduleViewModal";

vi.mock("shared", () => ({
  getMajorLabel: () => "프론트엔드",
}));

const schedule = {
  classNumber: "3305",
  interviewSchedule: "2026-05-30",
  interviewTime: "21:35",
  major: "FE",
  place: "가온실",
  scheduleId: 1,
  userName: "김필재",
};

describe("InterviewScheduleViewModal", () => {
  it("shows the edit button when interview schedule editing is allowed", () => {
    render(
      <InterviewScheduleViewModal
        canEditInterviewSchedule
        isOpen
        onBackdropClick={vi.fn()}
        onClose={vi.fn()}
        schedule={schedule}
      />,
    );

    expect(screen.getByRole("button", { name: "변경" })).toBeVisible();
  });

  it("hides the edit button when interview schedule editing is not allowed", () => {
    render(
      <InterviewScheduleViewModal
        canEditInterviewSchedule={false}
        isOpen
        onBackdropClick={vi.fn()}
        onClose={vi.fn()}
        schedule={schedule}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "변경" }),
    ).not.toBeInTheDocument();
  });
});
