"use client";

import Link from "next/link";
import { Button } from "ui";
import { useResolvedUserRole } from "@/hooks/useResolvedUserRole";

export function ClubCreationApplyCta() {
  const { isResolved: isRoleResolved, role } = useResolvedUserRole();
  const isClubAffiliated = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  if (!isRoleResolved || isClubAffiliated) {
    return null;
  }

  return (
    <div className="flex shrink-0">
      <Link href="/clubs/create" className="inline-flex">
        <Button
          variant="ghost"
          className="cursor-pointer rounded-xl bg-primary-500 p-6 text-white transition-all hover:bg-primary-600 hover:text-white hover:shadow-lg"
        >
          동아리 개설 신청하기
        </Button>
      </Link>
    </div>
  );
}
