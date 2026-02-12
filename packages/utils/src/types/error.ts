export interface ApiErrorResponse {
  description: string;
  message: string;
  status: number;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public readonly description: string,
    public readonly status: number,
    public readonly timestamp: string,
    public readonly originalMessage: string,
  ) {
    super(description);
    this.name = "ApiError";
  }
}
