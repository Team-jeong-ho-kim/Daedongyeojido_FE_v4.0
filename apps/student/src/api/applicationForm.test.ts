import { apiClient } from "utils";
import { getMySubmissionHistory } from "./applicationForm";

vi.mock("utils", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("getMySubmissionHistory", () => {
  it("maps applicationStatus from the server response to user_application_status", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        submissions: [
          {
            applicationStatus: "SUBMITTED",
            clubImage: "https://example.com/dog.jpeg",
            clubName: "coehgns",
            submissionDuration: "2026-12-23",
            submissionId: 6,
          },
        ],
      },
    });

    await expect(getMySubmissionHistory()).resolves.toEqual([
      {
        clubImage: "https://example.com/dog.jpeg",
        clubName: "coehgns",
        submissionDuration: "2026-12-23",
        submissionId: 6,
        user_application_status: "SUBMITTED",
      },
    ]);
  });
});
