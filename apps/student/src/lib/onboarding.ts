import type { UserInfo } from "shared";

const hasText = (value?: string | null) => Boolean(value?.trim());

const hasFilledLinks = (links?: string[] | null) =>
  Array.isArray(links) && links.some((link) => hasText(link));

export const isOnboardingRequired = (userInfo?: UserInfo | null) => {
  if (!userInfo) {
    return false;
  }

  return (
    !hasText(userInfo.profileImage) ||
    !hasText(userInfo.introduction) ||
    !Array.isArray(userInfo.major) ||
    userInfo.major.length === 0 ||
    !hasFilledLinks(userInfo.link)
  );
};
