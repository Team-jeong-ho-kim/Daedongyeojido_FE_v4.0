import { apiClient } from "utils";
import {
  createClubCreationApplication,
  updateClubCreationApplication,
} from "../clubCreation";

vi.mock("utils", () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

describe("clubCreation api", () => {
  it("keeps markdown introduction when creating an application", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { ok: true } });

    await createClubCreationApplication({
      clubCreationForm: new File(["pdf"], "club.pdf", {
        type: "application/pdf",
      }),
      clubName: "테스트 동아리",
      introduction: "## 소개\n\n**프론트엔드** 동아리",
      major: ["FRONTEND"],
      oneLiner: "한줄 소개",
      teacherId: 3,
    });

    const [, payload] = vi.mocked(apiClient.post).mock.calls[0];

    expect(payload).toBeInstanceOf(FormData);
    expect((payload as FormData).get("introduction")).toBe(
      "## 소개\n\n**프론트엔드** 동아리",
    );
  });

  it("keeps markdown introduction when updating an application", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { ok: true } });

    await updateClubCreationApplication({
      applicationId: 7,
      introduction: "- React\n- Next.js",
    });

    const [, payload] = vi.mocked(apiClient.patch).mock.calls[0];

    expect(payload).toBeInstanceOf(FormData);
    expect((payload as FormData).get("introduction")).toBe(
      "- React\n- Next.js",
    );
  });
});
