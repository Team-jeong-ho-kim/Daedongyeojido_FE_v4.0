import { render, screen } from "@testing-library/react";
import ApplicantCard from "../ApplicantCard";

const componentMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: () => <div data-testid="mock-image" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: componentMocks.push,
  }),
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    formatMajorList: (majors: string[]) => majors.join(", "),
    getMajorLabel: (major: string) => major,
  };
});

describe("ApplicantCard", () => {
  beforeEach(() => {
    componentMocks.push.mockReset();
  });

  it("renders a formatted applicant phone number when provided", () => {
    render(
      <ApplicantCard
        applicant={{
          classNumber: "2101",
          major: "BACKEND",
          phoneNumber: "01012345678",
          submissionId: 308,
          userName: "홍길동",
        }}
      />,
    );

    expect(screen.getByText("전화번호 :")).toBeVisible();
    expect(screen.getByText("010-1234-5678")).toBeVisible();
  });
});
