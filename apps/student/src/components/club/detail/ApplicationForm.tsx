import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type CreateApplicationFormRequest,
  createApplicationForm,
} from "@/api/applicationForm";
import { DeadlineModal } from "@/components";
import { FIELDS } from "@/constants/club";

interface ApplicationFormProps {
  onExit?: () => void;
}

export default function ApplicationForm({ onExit }: ApplicationFormProps) {
  const id = useId();
  const [applicationTitle, setApplicationTitle] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [questions, setQuestions] = useState<
    { id: number; text: string; isCompleted: boolean }[]
  >([]);
  const [editingQuestion, setEditingQuestion] = useState<{
    id: number;
    text: string;
    isCompleted: boolean;
  } | null>(null);
  const [deadline, setDeadline] = useState("");
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createMutation = useMutation({
    mutationFn: createApplicationForm,
    onSuccess: () => {
      toast.success("지원서가 성공적으로 생성되었습니다.");
      // 폼 초기화
      setApplicationTitle("");
      setSelectedFields([]);
      setQuestions([]);
      setDeadline("");
    },
    onError: (error) => {
      toast.error(`지원서 생성에 실패했습니다: ${error.message}`);
    },
  });

  const handleTextareaChange = (text: string) => {
    updateEditingQuestionText(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const addQuestion = () => {
    const newQuestion = { id: Date.now(), text: "", isCompleted: false };
    setEditingQuestion(newQuestion);
  };

  const completeQuestion = () => {
    if (editingQuestion?.text.trim()) {
      setQuestions([...questions, { ...editingQuestion, isCompleted: true }]);
      setEditingQuestion(null);
    }
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateEditingQuestionText = (text: string) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, text });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!applicationTitle.trim()) {
      toast.error("공고 제목을 입력해주세요.");
      return;
    }

    if (selectedFields.length === 0) {
      toast.error("전공을 하나 이상 선택해주세요.");
      return;
    }

    if (!deadline) {
      toast.error("지원 기한을 선택해주세요.");
      return;
    }

    if (questions.length === 0) {
      toast.error("최소 하나 이상의 질문을 추가해주세요.");
      return;
    }

    // API 요청 데이터 구성
    const formData: CreateApplicationFormRequest = {
      applicationFormTitle: applicationTitle,
      content: questions.map((q) => q.text),
      submissionDuration: deadline,
      majors: selectedFields,
    };

    createMutation.mutate(formData);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* 필수 정보 섹션 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
            <h2 className="mb-6 font-bold text-gray-900 text-xl md:mb-8 md:text-2xl">
              필수 정보
            </h2>

            <div className="space-y-5 md:space-y-6">
              {/* 공고 제목 */}
              <div>
                <label
                  htmlFor={`${id}-posting-title`}
                  className="mb-1.5 block font-medium text-gray-700 text-sm md:mb-2"
                >
                  공고 제목<span className="text-red-500">*</span>
                </label>
                <input
                  id={`${id}-posting-title`}
                  type="text"
                  placeholder="필수 입력"
                  value={applicationTitle}
                  onChange={(e) => setApplicationTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 md:rounded-xl md:px-4 md:py-3 md:text-base"
                />
              </div>

              {/* 전공 */}
              <div>
                <p className="mb-1.5 block font-medium text-gray-700 text-sm md:mb-2">
                  전공<span className="text-red-500">*</span>
                </p>
                <div className="flex min-h-[44px] flex-wrap gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 md:min-h-[48px] md:gap-2 md:rounded-xl md:px-4 md:py-3">
                  {FIELDS.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleField(field)}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] md:px-3 md:py-1 md:text-[13px] ${
                        selectedFields.includes(field)
                          ? "border-primary-500 bg-primary-50 text-primary-500"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>

              {/* 지원 기한 */}
              <div>
                <label
                  htmlFor={`${id}-deadline`}
                  className="mb-1.5 block font-medium text-gray-700 text-sm md:mb-2"
                >
                  지원 기한
                </label>
                <div className="relative">
                  <input
                    id={`${id}-deadline`}
                    type="date"
                    readOnly
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 md:rounded-xl md:px-4 md:py-3 md:text-base"
                  />
                </div>
              </div>

              {/* 일정 지정하기 버튼 */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeadlineModal(true)}
                  className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-gray-800 md:rounded-xl md:px-6 md:text-base"
                >
                  일정 지정하기
                </button>
              </div>
            </div>
          </div>

          {/* 추가 질문 섹션 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-3xl md:p-8">
            <h2 className="mb-6 font-bold text-gray-900 text-xl md:mb-8 md:text-2xl">
              추가 질문
            </h2>

            <div className="space-y-6">
              {questions.length === 0 && !editingQuestion && (
                <div className="py-8 text-center">
                  <p className="mb-6 text-gray-400">질문을 작성해주세요.</p>
                </div>
              )}

              {/* 완료된 질문들 */}
              {questions.map((question) => (
                <div key={question.id} className="pb-3">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 md:rounded-xl md:px-4 md:py-3">
                      <p className="break-words text-gray-700 text-sm md:text-base">
                        {question.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="shrink-0 rounded-lg bg-gray-400 px-3 py-3 text-[11px] text-white transition-colors hover:bg-gray-500 md:rounded-xl md:px-5 md:py-3 md:text-xs"
                    >
                      질문 삭제
                    </button>
                  </div>
                </div>
              ))}

              {/* 편집 중인 질문 */}
              {editingQuestion && (
                <div className="border-gray-100 border-b pb-4 md:pb-6">
                  <textarea
                    ref={textareaRef}
                    value={editingQuestion.text}
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    placeholder="질문을 작성해주세요."
                    rows={1}
                    className="mb-3 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400 md:mb-4 md:rounded-xl md:px-4 md:py-3 md:text-base"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-3 py-1.5 text-gray-600 text-sm transition-colors hover:text-gray-800 md:px-4 md:py-2 md:text-base"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={completeQuestion}
                      className="rounded-md bg-primary-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-primary-600 md:rounded-lg md:px-6 md:text-base"
                    >
                      작성 완료
                    </button>
                  </div>
                </div>
              )}

              {/* 질문 추가 버튼 - 편집 중이 아닐 때만 표시 */}
              {!editingQuestion && (
                <div className="flex justify-center pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-300 transition-colors hover:bg-gray-400 md:h-12 md:w-12 md:rounded-[6px]"
                  >
                    <Image
                      src="/images/icons/plus.svg"
                      alt="추가"
                      width={20}
                      height={20}
                      className="md:h-6 md:w-6"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼들 */}
          <div className="flex flex-col gap-3 md:flex-row md:justify-end md:gap-4">
            <button
              type="button"
              onClick={onExit}
              className="rounded-lg px-6 py-2.5 font-medium text-gray-900 text-sm transition-colors hover:bg-gray-100 md:rounded-xl md:bg-gray-900 md:px-8 md:text-base md:text-white md:hover:bg-gray-800"
            >
              나가기
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-primary-500 px-6 py-2.5 font-medium text-sm text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400 md:rounded-xl md:px-8 md:text-base"
            >
              {createMutation.isPending ? "생성 중..." : "지원서 생성하기"}
            </button>
          </div>
        </form>

        <DeadlineModal
          isOpen={showDeadlineModal}
          onClose={() => setShowDeadlineModal(false)}
          onSave={(newDeadline: string) => setDeadline(newDeadline)}
          title="지원서 일정 지정"
        />
      </div>
    </div>
  );
}
