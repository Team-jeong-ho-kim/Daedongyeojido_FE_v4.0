"use client";

import { useState } from "react";
import { MemberItem, Pagination } from "@/components";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { useDeleteClubMemberMutation } from "@/hooks/mutations/useClub";
import type { ClubMember } from "@/types";
import { AddMemberSection } from "./AddMemberSection";

interface ClubMemberSectionProps {
  clubId: string;
  clubMembers: ClubMember[];
  isLeader: boolean;
  studentNumber: string;
  setStudentNumber: (value: string) => void;
  studentName: string;
  setStudentName: (value: string) => void;
  onAddMemberRequest: () => void;
}

export function ClubMemberSection({
  clubId,
  clubMembers,
  isLeader,
  studentNumber,
  setStudentNumber,
  studentName,
  setStudentName,
  onAddMemberRequest,
}: ClubMemberSectionProps) {
  const [memberPage, setMemberPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
  });
  const memberLimit = 8;
  const { mutate: deleteClubMemberMutate } =
    useDeleteClubMemberMutation(clubId);

  const pagedMembers = clubMembers.slice(
    (memberPage - 1) * memberLimit,
    memberPage * memberLimit,
  );

  const handleDeleteClick = (userId: number, userName: string) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.userId) {
      deleteClubMemberMutate(deleteModal.userId);
    }
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  const handleCloseModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  return (
    <section className="flex flex-col gap-4 md:flex-row md:gap-0">
      <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
        동아리 팀원
      </h2>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* 팀원 이름 나열 */}
        <div className="flex flex-wrap gap-2">
          {clubMembers.map((member, index) => (
            <span
              key={`name-${member.userId}`}
              className="text-[14px] text-gray-700 md:text-[15px]"
            >
              {member.userName}
              {index < clubMembers.length - 1 && ","}
            </span>
          ))}
        </div>

        {/* 팀원 추가 섹션 - 리더만 */}
        {isLeader && (
          <AddMemberSection
            studentNumber={studentNumber}
            setStudentNumber={setStudentNumber}
            studentName={studentName}
            setStudentName={setStudentName}
            onAddMemberRequest={onAddMemberRequest}
          />
        )}

        <div className="grid min-h-[590px] grid-cols-2 content-start items-start gap-5 md:grid-cols-3 lg:grid-cols-4">
          {pagedMembers.map((member) => (
            <MemberItem
              key={`${member.userId}-${member.userName}`}
              {...member}
              canDelete={isLeader}
              onDelete={() => handleDeleteClick(member.userId, member.userName)}
            />
          ))}
        </div>

        {clubMembers.length > memberLimit && (
          <Pagination
            listLen={clubMembers.length}
            limit={memberLimit}
            curPage={memberPage}
            setCurPage={setMemberPage}
          />
        )}
      </div>

      <ApplicationConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        onBackdropClick={handleCloseModal}
        title={`${deleteModal.userName} 팀원을 삭제하시겠습니까?`}
        description="이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
      />
    </section>
  );
}
