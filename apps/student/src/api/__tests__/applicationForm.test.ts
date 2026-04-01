import { apiClient } from "utils";
import {
  getApplicationSubmissions,
  getMySubmissionDetail,
  getMySubmissionHistory,
  getSubmissionDetail,
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

describe("getApplicationSubmissions", () => {
  it("keeps applicant phoneNumber from the server response", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        applicants: [
          {
            classNumber: "2101",
            major: "BACKEND",
            phoneNumber: "01012345678",
            submissionId: 308,
            userName: "홍길동",
          },
        ],
      },
    });

    await expect(getApplicationSubmissions("11")).resolves.toEqual([
      {
        classNumber: "2101",
        major: "BACKEND",
        phoneNumber: "01012345678",
        submissionId: 308,
        userName: "홍길동",
      },
    ]);
  });
});

describe("getSubmissionDetail", () => {
  it("keeps phoneNumber from the server response", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        answers: [
          {
            content: "안녕하세요",
            questionContent: "자기소개",
            questionId: 1,
          },
        ],
        applicantId: 141,
        classNumber: "2101",
        clubApplicationStatus: "SUBMITTED",
        hasInterviewSchedule: true,
        introduction: "...",
        isInterviewCompleted: false,
        major: "BACKEND",
        phoneNumber: "01012345678",
        userName: "홍길동",
      },
    });

    await expect(getSubmissionDetail("308")).resolves.toEqual({
      answers: [
        {
          content: "안녕하세요",
          questionContent: "자기소개",
          questionId: 1,
        },
      ],
      applicantId: 141,
      classNumber: "2101",
      clubApplicationStatus: "SUBMITTED",
      hasInterviewSchedule: true,
      introduction: "...",
      isInterviewCompleted: false,
      major: "BACKEND",
      phoneNumber: "01012345678",
      userName: "홍길동",
    });
  });
});
