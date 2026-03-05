"use client";

import { formatDuration, useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminPage() {
  const {
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
  } = useAdminDashboard();

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">
          관리자 정보를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-gray-200 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-xl">대동여지도</span>
            <span className="rounded-full bg-primary-50 px-2 py-1 font-medium text-[11px] text-primary-700">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-gray-500 text-sm sm:inline">
              {userInfo?.userName} ({userInfo?.role})
            </span>
            <button
              type="button"
              onClick={loadClubs}
              disabled={loadingClubs}
              className="h-8 rounded-lg border border-gray-200 px-3 font-medium text-gray-700 text-xs transition hover:bg-gray-50 disabled:opacity-50"
            >
              새로고침
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="h-8 rounded-lg px-3 font-medium text-gray-600 text-xs transition hover:bg-gray-50 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mt-10 flex min-h-screen justify-center bg-white pt-10">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-bold text-3xl text-gray-900">
              동아리 전체 관리
            </h1>
            <p className="text-gray-500 text-sm">
              동아리 조회, 지원 결과 반영, 해체 요청
            </p>
          </div>

          {notice && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                notice.tone === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {notice.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 lg:col-span-3">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">
                동아리 목록
              </h2>
              {loadingClubs ? (
                <p className="text-gray-500 text-sm">불러오는 중...</p>
              ) : clubs.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  등록된 동아리가 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {clubs.map((club) => {
                    const isSelected = String(club.clubId) === selectedClubId;
                    return (
                      <button
                        type="button"
                        key={club.clubId}
                        onClick={() => setSelectedClubId(String(club.clubId))}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          isSelected
                            ? "border-primary-300 bg-primary-50 shadow-sm"
                            : "border-gray-200 hover:border-primary-200 hover:bg-primary-50/40"
                        }`}
                      >
                        <p className="font-semibold text-gray-900 text-sm">
                          {club.clubName}
                        </p>
                        <p className="mt-1 line-clamp-1 text-gray-500 text-xs">
                          {club.introduction}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 lg:col-span-5">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">
                동아리 상세 정보
              </h2>
              {!selectedClubId ? (
                <p className="text-gray-500 text-sm">동아리를 선택해주세요.</p>
              ) : loadingDetail ? (
                <p className="text-gray-500 text-sm">
                  상세 정보를 불러오는 중...
                </p>
              ) : !clubDetail ? (
                <p className="text-gray-500 text-sm">
                  상세 정보를 찾을 수 없습니다.
                </p>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="font-semibold text-base text-gray-900">
                      {clubDetail.club.clubName}
                    </p>
                    <p className="mt-1 text-gray-700 text-sm">
                      {clubDetail.club.oneLiner || "한줄 소개 없음"}
                    </p>
                    <p className="mt-2 text-gray-500 text-xs">
                      전공: {clubDetail.club.majors.join(", ") || "-"}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 text-sm">
                      동아리원
                    </h3>
                    {clubDetail.clubMembers.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        동아리원이 없습니다.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {clubDetail.clubMembers.map((member) => (
                          <li
                            key={member.userId}
                            className="rounded-2xl border border-gray-200 px-4 py-3"
                          >
                            <p className="font-medium text-gray-900 text-sm">
                              {member.userName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              ID: {member.userId} ·{" "}
                              {member.majors.join(", ") || "-"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 text-sm">
                      지원서 폼 목록 ({applicationForms.length})
                    </h3>
                    {applicationForms.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        지원서 폼이 없습니다.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {applicationForms.map((form) => (
                          <li
                            key={form.applicationFormId}
                            className="rounded-2xl border border-gray-200 px-4 py-3"
                          >
                            <p className="font-medium text-gray-900 text-sm">
                              {form.applicationFormTitle}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Form ID: {form.applicationFormId} · 마감:{" "}
                              {formatDuration(form.submissionDuration)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 lg:col-span-4">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">
                관리자 액션
              </h2>

              <form
                className="space-y-3 rounded-2xl border border-gray-200 p-4"
                onSubmit={handleDecision}
              >
                <h3 className="font-medium text-gray-900 text-sm">
                  합격 / 불합격 처리
                </h3>
                <p className="text-gray-500 text-xs">
                  PATCH /clubs/pass/{"{submission-id}"}
                </p>
                <input
                  value={submissionId}
                  onChange={(event) => setSubmissionId(event.target.value)}
                  placeholder="submission-id 입력"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`h-9 rounded-xl px-4 font-medium text-sm transition ${
                      isPassed
                        ? "bg-primary-500 text-white hover:bg-primary-600"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsPassed(true)}
                  >
                    합격
                  </button>
                  <button
                    type="button"
                    className={`h-9 rounded-xl px-4 font-medium text-sm transition ${
                      !isPassed
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsPassed(false)}
                  >
                    불합격
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={submittingDecision}
                  className="h-9 rounded-xl bg-primary-500 px-4 font-medium text-sm text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingDecision ? "처리 중..." : "결과 반영"}
                </button>
              </form>

              <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-black p-4">
                <h3 className="font-medium text-sm text-white">
                  동아리 해체 신청
                </h3>
                <p className="text-gray-400 text-xs">
                  POST /clubs/dissolution
                  {selectedClub ? ` · 현재 선택: ${selectedClub.clubName}` : ""}
                </p>
                <button
                  type="button"
                  className="h-9 rounded-xl bg-[#F45F5F] px-4 font-medium text-sm text-white transition hover:bg-[#e34f4f] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleDissolve}
                  disabled={submittingDissolve || !selectedClubId}
                >
                  {submittingDissolve ? "요청 중..." : "해체 요청 전송"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
