export type Major = "BE" | "FE" | "iOS";

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

export interface PaginationType {
  listLen: number; // 리스트의 전체 길이
  limit: number; // 한 페이지에 표시할 데이터 개수
  curPage: number; // 현재 리스트에 표시할 페이지
  setCurPage: (page: number) => void; // curPage의 값을 변경하기 위한 setState 함수
}
