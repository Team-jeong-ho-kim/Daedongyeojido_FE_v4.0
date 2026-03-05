"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "utils";
import {
  decidePass,
  dissolveClub,
  getAllClubs,
  getClubApplicationForms,
  getClubDetail,
  logout,
} from "@/api/admin";
import { clearTokens, getAccessToken, getAdminSessionUser } from "@/lib/token";
import type {
  AdminUserInfo,
  ApplicationFormListItem,
  ClubDetailResponse,
  ClubSummary,
} from "@/types/admin";

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

export const formatDuration = (value?: [number, number, number] | string) => {
  if (!value) return "-";
  if (Array.isArray(value)) {
    const [year, month, day] = value;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  }
  return value;
};

export const useAdminDashboard = () => {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [userInfo, setUserInfo] = useState<AdminUserInfo | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>("");

  const [clubDetail, setClubDetail] = useState<ClubDetailResponse | null>(null);
  const [applicationForms, setApplicationForms] = useState<
    ApplicationFormListItem[]
  >([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [submissionId, setSubmissionId] = useState("");
  const [isPassed, setIsPassed] = useState(true);
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [submittingDissolve, setSubmittingDissolve] = useState(false);

  const loadClubs = useCallback(async () => {
    setLoadingClubs(true);
    try {
      const list = await getAllClubs();
      setClubs(list);
      setSelectedClubId((previous) => {
        if (list.length === 0) return "";
        if (!previous) return String(list[0].clubId);

        const isValidSelection = list.some(
          (club) => String(club.clubId) === previous,
        );

        return isValidSelection ? previous : String(list[0].clubId);
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: toErrorMessage(error, "동아리 목록 조회에 실패했습니다."),
      });
    } finally {
      setLoadingClubs(false);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        router.replace("/login");
        setBooting(false);
        return;
      }

      try {
        const sessionUser = getAdminSessionUser();
        if (!sessionUser || sessionUser.role !== "ADMIN") {
          clearTokens();
          router.replace("/login");
          return;
        }

        setUserInfo({
          classNumber: "",
          clubName: null,
          introduction: null,
          link: [],
          major: [],
          profileImage: null,
          role: sessionUser.role,
          userName: sessionUser.userName,
        });
        await loadClubs();
      } catch {
        clearTokens();
        router.replace("/login");
      } finally {
        setBooting(false);
      }
    };

    bootstrap();
  }, [loadClubs, router]);

  useEffect(() => {
    const loadClubData = async () => {
      if (!selectedClubId) {
        setClubDetail(null);
        setApplicationForms([]);
        return;
      }

      setLoadingDetail(true);
      try {
        const [detail, forms] = await Promise.all([
          getClubDetail(selectedClubId),
          getClubApplicationForms(selectedClubId),
        ]);
        setClubDetail(detail);
        setApplicationForms(forms);
      } catch (error) {
        setClubDetail(null);
        setApplicationForms([]);
        setNotice({
          tone: "error",
          message: toErrorMessage(
            error,
            "동아리 상세 데이터를 불러오지 못했습니다.",
          ),
        });
      } finally {
        setLoadingDetail(false);
      }
    };

    loadClubData();
  }, [selectedClubId]);

  const selectedClub = useMemo(
    () => clubs.find((club) => String(club.clubId) === selectedClubId),
    [clubs, selectedClubId],
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 로그아웃 API 실패 시에도 로컬 토큰은 삭제한다.
    } finally {
      clearTokens();
      router.replace("/login");
    }
  };

  const handleDecision = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submissionId.trim()) {
      setNotice({ tone: "error", message: "지원서 ID를 입력해주세요." });
      return;
    }

    setSubmittingDecision(true);
    setNotice(null);

    try {
      await decidePass(submissionId.trim(), isPassed);
      setNotice({
        tone: "success",
        message: `지원서 ${submissionId.trim()}를 ${isPassed ? "합격" : "불합격"} 처리했습니다.`,
      });
      setSubmissionId("");
    } catch (error) {
      setNotice({
        tone: "error",
        message: toErrorMessage(error, "합격/불합격 처리에 실패했습니다."),
      });
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleDissolve = async () => {
    if (!selectedClubId) {
      setNotice({
        tone: "error",
        message: "해체 요청할 동아리를 먼저 선택해주세요.",
      });
      return;
    }

    setSubmittingDissolve(true);
    setNotice(null);

    try {
      await dissolveClub();
      setNotice({
        tone: "success",
        message: "동아리 해체 신청 요청을 전송했습니다.",
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: toErrorMessage(error, "동아리 해체 신청에 실패했습니다."),
      });
    } finally {
      setSubmittingDissolve(false);
    }
  };

  return {
    applicationForms,
    booting,
    clubDetail,
    clubs,
    handleDecision,
    handleDissolve,
    handleLogout,
    isPassed,
    loadingClubs,
    loadingDetail,
    notice,
    selectedClub,
    selectedClubId,
    setIsPassed,
    setSelectedClubId,
    setSubmissionId,
    submissionId,
    submittingDecision,
    submittingDissolve,
    userInfo,
    loadClubs,
  };
};
