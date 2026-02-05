// User Info Update Types
export interface UpdateMyInfoRequest {
  introduction: string;
  phoneNumber?: string;
  majors: string[];
  links: string[];
  profileImage?: File | null;
}

export interface UpdateProfileRequest {
  introduction: string;
  majors: string[];
  links: string[];
  profileImage?: File | null;
  existingImageUrl?: string;
}
