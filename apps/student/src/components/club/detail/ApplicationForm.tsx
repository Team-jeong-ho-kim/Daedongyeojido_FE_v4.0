import Image from "next/image";
import { useId, useRef, useState } from "react";
import { DeadlineModal } from "@/components";
import { FIELDS } from "@/constants/club";

interface ApplicationFormProps {
  onExit?: () => void;
}

export default function ApplicationForm({ onExit }: ApplicationFormProps) {
  const id = useId();
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

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <form className="space-y-8">
          {/* 필수 정보 섹션 */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-8 font-bold text-2xl text-gray-900">필수 정보</h2>

            <div className="space-y-6">
              {/* 공고 제목 */}
              <div>
                <label
                  htmlFor={`${id}-posting-title`}
                  className="mb-2 block font-medium text-gray-700 text-sm"
                >
                  공고 제목<span className="text-red-500">*</span>
                </label>
                <input
                  id={`${id}-posting-title`}
                  type="text"
                  placeholder="필수 입력"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* 이름 */}
              <div>
                <label
                  htmlFor={`${id}-name`}
                  className="mb-2 block font-medium text-gray-700 text-sm"
                >
                  이름<span className="text-red-500">*</span>
                </label>
                <input
                  id={`${id}-name`}
                  type="text"
                  placeholder="필수 입력"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* 학번 */}
              <div>
                <label
                  htmlFor={`${id}-student-id`}
                  className="mb-2 block font-medium text-gray-700 text-sm"
                >
                  학번<span className="text-red-500">*</span>
                </label>
                <input
                  id={`${id}-student-id`}
                  type="text"
                  placeholder="필수 입력"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* 전공 */}
              <div>
                <p className="mb-2 block font-medium text-gray-700 text-sm">
                  전공<span className="text-red-500">*</span>
                </p>
                <div className="flex min-h-[48px] flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  {FIELDS.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleField(field)}
                      className={`rounded-full border px-3 py-1 text-[12px] md:text-[13px] ${
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

              {/* 지기소개 */}
              <div>
                <label
                  htmlFor={`${id}-introduction`}
                  className="mb-2 block font-medium text-gray-700 text-sm"
                >
                  지기소개<span className="text-red-500">*</span>
                </label>
                <input
                  id={`${id}-introduction`}
                  type="text"
                  placeholder="필수 입력"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* 지원 기한 */}
              <div>
                <label
                  htmlFor={`${id}-deadline`}
                  className="mb-2 block font-medium text-gray-700 text-sm"
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              {/* 일정 지정하기 버튼 */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeadlineModal(true)}
                  className="rounded-xl bg-gray-900 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                >
                  일정 지정하기
                </button>
              </div>
            </div>
          </div>

          {/* 추가 질문 섹션 */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-8 font-bold text-2xl text-gray-900">추가 질문</h2>

            <div className="space-y-6">
              {questions.length === 0 && !editingQuestion && (
                <div className="py-8 text-center">
                  <p className="mb-6 text-gray-400">질문을 작성해주세요.</p>
                </div>
              )}

              {/* 완료된 질문들 */}
              {questions.map((question) => (
                <div key={question.id} className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="break-words text-gray-700">
                        {question.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="shrink-0 rounded-xl bg-gray-400 px-5 py-3 text-white text-xs transition-colors hover:bg-gray-500"
                    >
                      질문 삭제
                    </button>
                  </div>
                </div>
              ))}

              {/* 편집 중인 질문 */}
              {editingQuestion && (
                <div className="border-gray-100 border-b pb-6">
                  <textarea
                    ref={textareaRef}
                    value={editingQuestion.text}
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    placeholder="질문을 작성해주세요."
                    rows={1}
                    className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={completeQuestion}
                      className="rounded-lg bg-primary-500 px-6 py-1 text-white transition-colors hover:bg-primary-600"
                    >
                      작성 완료
                    </button>
                  </div>
                </div>
              )}

              {/* 질문 추가 버튼 - 편집 중이 아닐 때만 표시 */}
              {!editingQuestion && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-gray-300 transition-colors hover:bg-gray-400"
                  >
                    <Image
                      src="/images/icons/plus.svg"
                      alt="추가"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼들 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onExit}
              className="rounded-xl bg-gray-900 px-8 py-2 font-medium text-white transition-colors hover:bg-gray-800"
            >
              나가기
            </button>
            <button
              type="button"
              className="rounded-xl bg-gray-900 px-8 py-2 font-medium text-white transition-colors hover:bg-gray-800"
            >
              지원서 수정하기
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gray-400 px-8 py-2 font-medium text-white transition-colors hover:bg-gray-500"
            >
              지원서 삭제하기
            </button>
          </div>
        </form>

        <DeadlineModal
          isOpen={showDeadlineModal}
          onClose={() => setShowDeadlineModal(false)}
          onSave={(newDeadline: string) => setDeadline(newDeadline)}
        />
      </div>
    </div>
  );
}
