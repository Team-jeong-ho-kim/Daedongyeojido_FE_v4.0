export interface LoginRequest {
  account_id: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
}
