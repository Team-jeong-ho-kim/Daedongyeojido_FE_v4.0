import type { Application } from "@/components";
import type { ClubDetail, ClubMember, JobPosting } from "@/types";

export const MOCK_CLUB: ClubDetail = {
  clubName: "대동여지도",
  oneLiner: "혼자가기 싫어요... 같이 가요, 레~츠고",
  introduction:
    "대덕소프트웨어마이스터고 전공 동아리입니다. 학교의 모든 정보를 한눈에 볼 수 있도록 서비스를 개발합니다.",
  clubImage: "/logo.png",
  majors: ["BE", "FE"],
  links: ["https://github.com/example", "https://example.com"],
};

export const MOCK_CLUB_MEMBERS: ClubMember[] = [
  {
    userId: 1212,
    userName: "김경민",
    majors: ["BE", "FE"],
    introduction:
      "김경민입니다.ㅁㄴㅇㄹㄴㅁㄹㄴㅁㄹㅁㄴㅁㄴㄹㅁㄴㄴㅇㄹㅁㄴㅇㄹㄴㅁㅇㄹㅁㄴㅇㄹㄴㅁㅇㄹ",
  },
  {
    userId: 12122,
    userName: "지도현",
    majors: ["BE"],
    introduction: "지도현입니다.",
  },
  {
    userId: 1212312,
    userName: "박민수",
    majors: ["FE"],
    introduction: "박민수입니다.",
  },
  {
    userId: 12132,
    userName: "이준호",
    majors: ["BE"],
    introduction: "이준호입니다.",
  },
  {
    userId: 121342,
    userName: "최유진",
    majors: ["FE"],
    introduction: "최유진입니다.",
  },
];

export const MOCK_JOB_POSTINGS: JobPosting[] = [
  {
    status: "진행중",
    title: "2025년 상반기 신입 모집",
    date: "2025.03.01",
    content:
      "2025년 상반기 신입 부원을 모집합니다. 열정 있는 분들의 많은 지원 바랍니다. 모집 분야: FE, BE, iOS, Android",
  },
  {
    status: "종료됨",
    title: "iOS 추가 모집합니다",
    date: "2025.12.24",
    content:
      "iOS 개발자를 추가 모집합니다. Swift 경험자 우대, 포트폴리오 필수 제출.",
  },
  {
    status: "종료됨",
    title: "백엔드 개발자 모집",
    date: "2025.11.15",
    content:
      "백엔드 개발자를 모집합니다. Spring Boot, Node.js 경험자 환영합니다.",
  },
  {
    status: "종료됨",
    title: "프론트엔드 개발자 모집",
    date: "2025.10.20",
    content:
      "프론트엔드 개발자를 모집합니다. React, Next.js 경험자 우대합니다.",
  },
  {
    status: "종료됨",
    title: "디자이너 모집",
    date: "2025.09.10",
    content: "UI/UX 디자이너를 모집합니다. Figma 사용 가능자 환영합니다.",
  },
  {
    status: "종료됨",
    title: "PM 모집",
    date: "2025.08.05",
    content:
      "프로젝트 매니저를 모집합니다. 일정 관리 및 팀 커뮤니케이션 능력 필수.",
  },
];

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
}

export const MOCK_NOTICES: Notice[] = [
  {
    id: "1",
    title: "10월 회식 안합니다.",
    date: "2025.12.24",
    content:
      "어떻게 어떻게 과제를 낸 후 난 잘것이야. 진짜 너무 피곤해 어떻게 어떻게 과제를 낸 후 난 잘것이야.",
  },
  {
    id: "2",
    title: "11월 정기 회의 공지",
    date: "2025.11.15",
    content:
      "11월 정기 회의는 15일 오후 6시에 진행됩니다. 모두 참석 부탁드립니다.",
  },
  {
    id: "3",
    title: "프로젝트 마감일 연장 안내",
    date: "2025.11.10",
    content:
      "프로젝트 마감일이 일주일 연장되었습니다. 새로운 마감일은 11월 20일입니다.",
  },
  {
    id: "4",
    title: "신입 부원 환영회",
    date: "2025.10.28",
    content:
      "신입 부원 환영회가 10월 30일에 진행됩니다. 많은 참여 부탁드립니다.",
  },
  {
    id: "5",
    title: "동아리 방 청소 공지",
    date: "2025.10.20",
    content:
      "이번 주 토요일 동아리 방 청소를 진행합니다. 담당자는 아래와 같습니다.",
  },
  {
    id: "6",
    title: "해커톤 참가 안내",
    date: "2025.10.15",
    content:
      "교내 해커톤에 동아리 팀으로 참가합니다. 참가 희망자는 신청해주세요.",
  },
  {
    id: "7",
    title: "동아리 티셔츠 제작 안내",
    date: "2025.10.10",
    content: "동아리 티셔츠를 제작합니다. 사이즈 신청은 이번 주까지입니다.",
  },
  {
    id: "8",
    title: "9월 정기 회의록",
    date: "2025.09.30",
    content: "9월 정기 회의록을 공유드립니다. 확인 부탁드립니다.",
  },
  {
    id: "9",
    title: "외부 강연 안내",
    date: "2025.09.25",
    content: "외부 개발자 강연이 예정되어 있습니다. 많은 참여 부탁드립니다.",
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  { id: 1, title: "2025년 상반기 신입 모집 지원서", deadline: "2025.03.15" },
  { id: 2, title: "iOS 개발자 추가 모집 지원서", deadline: "2025.12.31" },
  { id: 3, title: "백엔드 개발자 모집 지원서", deadline: "2025.11.30" },
  { id: 4, title: "프론트엔드 개발자 모집 지원서", deadline: "2025.10.25" },
];

export interface Applicant {
  name: string;
  studentId: string;
  position: string;
  interviewDate: string;
  applicationId: string;
  announcementId: string;
}

export const MOCK_APPLICANTS: Applicant[] = [
  {
    name: "김민수",
    studentId: "2301",
    position: "FE",
    interviewDate: "2025.03.20",
    applicationId: "101",
    announcementId: "1",
  },
  {
    name: "이지영",
    studentId: "2302",
    position: "BE",
    interviewDate: "2025.03.21",
    applicationId: "102",
    announcementId: "1",
  },
  {
    name: "박준혁",
    studentId: "2303",
    position: "iOS",
    interviewDate: "2025.03.22",
    applicationId: "103",
    announcementId: "1",
  },
  {
    name: "최서연",
    studentId: "2304",
    position: "Android",
    interviewDate: "2025.03.23",
    applicationId: "104",
    announcementId: "2",
  },
  {
    name: "정도현",
    studentId: "2305",
    position: "FE",
    interviewDate: "2025.03.24",
    applicationId: "105",
    announcementId: "2",
  },
  {
    name: "한소희",
    studentId: "2306",
    position: "BE",
    interviewDate: "2025.03.25",
    applicationId: "106",
    announcementId: "2",
  },
];
