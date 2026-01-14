"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ApplicationConfirmModal,
  InterviewDetailModal,
  InterviewScheduleModal,
} from "@/components";

// Mock data - 실제로는 서버에서 받아올 데이터
const mockData = {
  name: "박태수",
  studentId: "2107",
  introduction: "안녕하세요 저 뽑아주세요",
  majors: ["Frontend", "Backend", "Design", "iOS"],
  selectedMajor: "Frontend",
  questions: [
    {
      id: 1,
      question: "너의 이름은?",
      answer: "박태수다",
    },
    {
      id: 2,
      question: "키미노 나마에와?",
      answer: `나마에와 미츠하! 미츠하!
마다 코노 세카이와 보쿠오 카이너라 시테 타이 미타이야
노조미도오리 이마다로오 우츠쿠시쿠 모가루요

타카이노나 스카이노 니가라 카이소오 시오오오오 사요나라! 카라
베시나 토모오오 미와세 마치아에요오

초이니 토키와 키타 코오메타와 조소오소 조소데 토바사 코미미데
이카라라 코코카라 보쿠다요

~~~

은에미어도카가 미라이로츠레 코토바가 도레타케 데오 노바스무로
토도카나이 바쇼데 보쿠라 코이오 스루`,
    },
  ],
};

export default function ApplicationDetailPage() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [interviewSchedule, setInterviewSchedule] = useState<{
    date: string;
    time: string;
    location: string;
  } | null>(null);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);

  const handleSaveInterview = (schedule: {
    date: string;
    time: string;
    location: string;
  }) => {
    setInterviewSchedule(schedule);
    console.log("면접 일정 저장:", schedule);
    toast.success(`${mockData.name}님의 면접 일정이 설정되었습니다.`);
    // TODO: API 호출
  };

  const handleShowDetail = () => {
    if (interviewSchedule) {
      setShowDetailModal(true);
    } else {
      toast.error("설정된 면접 일정이 없습니다.");
    }
  };

  const handleInterviewComplete = () => {
    setShowDetailModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmComplete = () => {
    setIsInterviewCompleted(true);
    setShowConfirmModal(false);
    toast.success("면접이 완료되었습니다.");
    // TODO: API 호출
  };

  const handleReject = () => {
    toast.success("지원자를 탈락 처리했습니다.");
    // TODO: API 호출
  };

  const handleAccept = () => {
    toast.success("지원자를 합격 처리했습니다.");
    // TODO: API 호출
  };
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        {/* 인적 사항 */}
        <section className="rounded-xl bg-white">
          <div className="grid grid-cols-[180px_1fr] gap-x-10 gap-y-8">
            <div className="font-semibold text-gray-900 text-xl">인적 사항</div>
            <div />

            {/* 이름 */}
            <div className="flex items-start pt-3 font-medium text-gray-800 text-sm">
              이름
            </div>
            <div>
              <div className="flex h-12 w-full items-center rounded-lg bg-gray-100 px-5 text-gray-700 text-sm">
                {mockData.name}
              </div>
            </div>

            {/* 학번 */}
            <div className="flex items-start pt-3 font-medium text-gray-800 text-sm">
              학번
            </div>
            <div>
              <div className="flex h-12 w-full items-center rounded-lg bg-gray-100 px-5 text-gray-700 text-sm">
                {mockData.studentId}
              </div>
            </div>

            {/* 자기소개 */}
            <div className="flex items-start pt-3 font-medium text-gray-800 text-sm">
              자기소개
            </div>
            <div>
              <div className="min-h-[160px] w-full rounded-lg bg-gray-100 px-5 py-4 text-gray-700 text-sm">
                {mockData.introduction}
              </div>
            </div>

            {/* 지원 전공 */}
            <div className="flex items-start pt-3 font-medium text-gray-800 text-sm">
              지원 전공
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {mockData.majors.map((major) => (
                <Chip key={major} active={major === mockData.selectedMajor}>
                  {major}
                </Chip>
              ))}
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="my-10 h-px w-full bg-gray-200" />

        {/* 질문 답변 */}
        <section>
          <h2 className="font-semibold text-gray-900 text-xl">질문 답변</h2>

          <div className="mt-6 space-y-8">
            {mockData.questions.map((item, index) => (
              <div key={item.id}>
                <div className="font-semibold text-gray-900 text-sm">
                  Q{index + 1}. {item.question}
                </div>
                <div className="mt-3 min-h-[170px] w-full whitespace-pre-line rounded-lg bg-gray-100 px-5 py-4 text-gray-700 text-sm">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="mt-10 flex justify-end gap-3">
            {!isInterviewCompleted ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(true)}
                  className="h-10 rounded-lg bg-primary-500 px-5 font-semibold text-sm text-white shadow-sm hover:bg-primary-600"
                >
                  면접 일정 설정
                </button>
                <button
                  type="button"
                  onClick={handleShowDetail}
                  className="h-10 rounded-lg bg-gray-900 px-5 font-semibold text-sm text-white shadow-sm hover:bg-gray-800"
                >
                  면접 일정 조회
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  className="h-10 rounded-lg bg-gray-500 px-5 font-semibold text-sm text-white shadow-sm hover:bg-gray-600"
                >
                  탈락
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="h-10 rounded-lg bg-primary-500 px-5 font-semibold text-sm text-white shadow-sm hover:bg-primary-600"
                >
                  합격
                </button>
              </>
            )}
          </div>
        </section>
      </div>

      {/* 면접 일정 설정 모달 */}
      <InterviewScheduleModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSave={handleSaveInterview}
      />

      {/* 면접 일정 상세 조회 모달 */}
      {interviewSchedule && (
        <InterviewDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onComplete={handleInterviewComplete}
          applicant={{
            name: mockData.name,
            studentId: mockData.studentId,
            major: mockData.selectedMajor,
          }}
          interview={interviewSchedule}
        />
      )}

      {/* 면접 완료 확인 모달 */}
      <ApplicationConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmComplete}
        onBackdropClick={() => setShowConfirmModal(false)}
        title="정말 면접을 완료하시겠습니까?"
        description="면접 완료 후 탈락/합격 처리를 진행할 수 있습니다."
        cancelText="아니요"
        confirmText="예"
      />
    </main>
  );
}

function Chip({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-4 font-normal text-xs",
        active
          ? "border-primary-500 bg-primary-50 text-primary-500"
          : "border-gray-400 bg-white text-gray-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
