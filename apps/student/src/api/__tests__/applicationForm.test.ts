import { apiClient } from "utils";
import {
  getMySubmissionDetail,
  getMySubmissionHistory,
} from "../applicationForm";

vi.mock("utils", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("getMySubmissionHistory", () => {
  it("keeps applicationStatus from the server response", async () => {
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
        applicationStatus: "SUBMITTED",
      },
    ]);
  });
});

describe("getMySubmissionDetail", () => {
  it("keeps userApplicationStatus and clubApplicationStatus from the server response", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        classNumber: "2101",
        clubApplicationStatus: "ACCEPTED",
        clubImage: "https://example.com/image.jpeg",
        clubName: "백로란트",
        contents: [
          {
            answer: "...",
            question: "지원 동기",
          },
        ],
        introduction: "안녕하세요",
        major: "FE",
        submissionDuration: "2026-03-30",
        userApplicationStatus: "SUBMITTED",
        userName: "홍길동",
      },
    });

    await expect(getMySubmissionDetail("6")).resolves.toEqual({
      classNumber: "2101",
      clubApplicationStatus: "ACCEPTED",
      clubImage: "https://example.com/image.jpeg",
      clubName: "백로란트",
      contents: [
        {
          answer: "...",
          question: "지원 동기",
        },
      ],
      introduction: "안녕하세요",
      major: "FE",
      submissionDuration: "2026-03-30",
      userName: "홍길동",
      userApplicationStatus: "SUBMITTED",
    });
  });
});
