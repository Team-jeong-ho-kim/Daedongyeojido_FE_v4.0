import type { Major } from "./major";

export interface Club {
  clubId: number;
  clubName: string;
  clubImage: string;
  introduction: string;
  majors: Major[];
}

export interface ClubsResponse {
  clubs: Club[];
}

export interface ClubDetail {
  clubName: string;
  introduction: string;
  oneLiner: string;
  clubImage: string;
  majors: string[];
  links: string[];
}

export interface ClubUpdate {
  clubName: string;
  introduction: string;
  oneLiner: string;
  major: string[];
  link: string[];
}

export interface ClubMember {
  userId: number;
  userName: string;
  majors: Major[];
  introduce: string | null;
}

export interface ClubDetailResponse {
  club: ClubDetail;
  clubMembers: ClubMember[];
}

export interface PaginationType {
  listLen: number; // 리스트의 전체 길이
  limit: number; // 한 페이지에 표시할 데이터 개수
  curPage: number; // 현재 리스트에 표시할 페이지
  setCurPage: (page: number) => void; // curPage의 값을 변경하기 위한 setState 함수
}

export interface JobPosting {
  status: "종료됨" | "진행중";
  title: string;
  date: string;
  content?: string;
}
