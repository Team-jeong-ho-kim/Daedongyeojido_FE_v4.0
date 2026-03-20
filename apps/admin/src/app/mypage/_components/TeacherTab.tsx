import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useAddTeacher } from "@/hooks/mutations";
import { useGetAllTeachersQuery } from "@/hooks/querys";
import { PanelCard } from "./PanelCard";

export function TeacherTab() {
  const addTeacherMutation = useAddTeacher();
  const teachersQuery = useGetAllTeachersQuery();
  const [teacherName, setTeacherName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");

  const handleAddTeacher = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTeacherName = teacherName.trim();
    const trimmedAccountId = accountId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedTeacherName || !trimmedAccountId || !trimmedPassword) {
      toast.error("이름, 계정 ID, 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      await addTeacherMutation.mutateAsync({
        teacherName: trimmedTeacherName,
        accountId: trimmedAccountId,
        password: trimmedPassword,
      });
      setTeacherName("");
      setAccountId("");
      setPassword("");
    } catch {}
  };

  return (
    <div className="space-y-5">
      <PanelCard
        title="지도 교사 전체 조회"
        description="등록된 지도 교사 계정을 조회합니다."
      >
        {teachersQuery.isLoading ? (
          <p className="text-gray-500 text-sm">
            지도 교사 목록을 불러오는 중입니다...
          </p>
        ) : teachersQuery.isError ? (
          <p className="text-red-500 text-sm">
            지도 교사 목록을 불러오지 못했습니다.
          </p>
        ) : teachersQuery.data && teachersQuery.data.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="grid grid-cols-[120px_1fr_120px] bg-gray-50 px-4 py-3 font-medium text-gray-500 text-sm">
              <span>교사 ID</span>
              <span>지도 교사 이름</span>
              <span className="text-right">매칭 여부</span>
            </div>
            <ul>
              {teachersQuery.data.map((teacher) => (
                <li
                  key={teacher.teacherId}
                  className="grid grid-cols-[120px_1fr_120px] items-center border-gray-100 border-t px-4 py-3 text-sm"
                >
                  <span className="font-medium text-gray-600">
                    #{teacher.teacherId}
                  </span>
                  <span className="text-gray-900">{teacher.teacherName}</span>
                  <div className="flex justify-end">
                    <span
                      className={`rounded-full border px-3 py-1 font-medium text-[12px] ${
                        teacher.matched
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}
                    >
                      {teacher.matched ? "매칭됨" : "미매칭"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">등록된 지도 교사가 없습니다.</p>
        )}
      </PanelCard>

      <PanelCard
        title="지도 교사 추가"
        description="지도 교사 이름, 계정 ID, 비밀번호를 입력해 새 계정을 생성합니다."
      >
        <form
          autoComplete="off"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          className="space-y-3"
          onSubmit={handleAddTeacher}
        >
          <div className="grid max-w-md gap-3">
            <input
              value={teacherName}
              onChange={(event) => setTeacherName(event.target.value)}
              placeholder="지도 교사 이름"
              autoComplete="off"
              disabled={addTeacherMutation.isPending}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            />
            <input
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              placeholder="계정 ID"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              disabled={addTeacherMutation.isPending}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              autoComplete="new-password"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              disabled={addTeacherMutation.isPending}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              disabled={addTeacherMutation.isPending}
            >
              {addTeacherMutation.isPending ? "추가 중..." : "지도 교사 추가"}
            </button>
          </div>
        </form>
      </PanelCard>
    </div>
  );
}
