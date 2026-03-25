import { render, screen } from "@testing-library/react";
import { ClubInfoEditSection } from "./ClubInfoEditSection";

const baseProps = {
  club: {
    clubId: 1,
    clubImage: "",
    clubName: "테스트 동아리",
    introduction: "## 소개\n\n- React\n- Next.js",
    links: [],
    majors: ["FRONTEND"],
    oneLiner: "한줄 소개",
  },
  editClubImage: "",
  editClubName: "테스트 동아리",
  editIntroduction: "## 소개\n\n- React\n- Next.js",
  editLinks: [],
  editMajors: ["FRONTEND"],
  editOneLiner: "한줄 소개",
  isClubMember: false,
  setEditClubImage: vi.fn(),
  setEditClubImageFile: vi.fn(),
  setEditClubName: vi.fn(),
  setEditIntroduction: vi.fn(),
  setEditLinks: vi.fn(),
  setEditOneLiner: vi.fn(),
  toggleMajor: vi.fn(),
};

describe("ClubInfoEditSection", () => {
  it("renders club introduction as markdown in read mode", () => {
    render(<ClubInfoEditSection {...baseProps} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "소개" }),
    ).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("Next.js")).toBeVisible();
  });
});
