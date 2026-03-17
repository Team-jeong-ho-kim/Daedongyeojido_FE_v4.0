"use client";

import {
  ManualPdfPreviewModal,
  type DocumentPreviewModalClassNames,
  type ManualPdfPreviewModalProps,
} from "ui";
import { BodyPortal } from "./BodyPortal";

const teacherPreviewModalClassNames: DocumentPreviewModalClassNames = {
  actions: "gap-2 md:gap-3",
  closeButton: "h-9 w-9 md:h-10 md:w-10",
  content: "p-2 sm:p-3 md:p-5",
  fileName: "mt-1 text-[12px] leading-5 md:text-sm",
  header: "gap-3 px-4 py-3 sm:px-5 sm:py-4 md:px-7",
  overlay: "p-2 sm:p-3 md:p-8",
  title: "text-lg md:text-xl",
};

const teacherDownloadButtonClassName =
  "h-9 px-3.5 text-[13px] md:h-10 md:px-4 md:text-sm";

type TeacherClubCreationPreviewModalProps = Pick<
  ManualPdfPreviewModalProps,
  "fileName" | "isOpen" | "onClose" | "pdfPath" | "title"
>;

export function TeacherClubCreationPreviewModal({
  fileName,
  isOpen,
  onClose,
  pdfPath,
  title,
}: TeacherClubCreationPreviewModalProps) {
  return (
    <BodyPortal>
      <ManualPdfPreviewModal
        fileName={fileName}
        isOpen={isOpen}
        onClose={onClose}
        pdfPath={pdfPath}
        title={title}
        modalClassNames={teacherPreviewModalClassNames}
        downloadButtonClassName={teacherDownloadButtonClassName}
      />
    </BodyPortal>
  );
}
