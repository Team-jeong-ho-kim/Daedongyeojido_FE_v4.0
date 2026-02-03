export interface LoginRequest {
  accountId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
}
