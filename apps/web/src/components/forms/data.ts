export type FormPreviewSection = {
  title: string;
  fields: string[];
};

export type FormItem = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  lastUpdated: string;
  fileName: string;
  sections: FormPreviewSection[];
  notes: string[];
};

export const formItems: FormItem[] = [
  {
    slug: "club-opening-application",
    title: "동아리 개설 신청 양식",
    summary: "전공동아리 신규 개설을 위해 제출하는 기본 신청 양식입니다.",
    description:
      "동아리 개설 목적, 운영 계획, 구성원 계획 등을 한 번에 정리할 수 있도록 구성한 기본 양식입니다. 추후 실제 문서 파일이 전달되면 같은 경로에 원본 파일 다운로드로 바로 교체할 수 있습니다.",
    category: "개설 신청",
    lastUpdated: "2026.03.12",
    fileName: "동아리-개설-신청-양식.txt",
    sections: [
      {
        title: "기본 정보",
        fields: [
          "동아리명",
          "담당 교사",
          "대표 학생",
          "개설 희망 학기",
          "활동 분야",
        ],
      },
      {
        title: "개설 목적",
        fields: ["동아리 개설 배경", "운영 목표", "기대 효과"],
      },
      {
        title: "운영 계획",
        fields: [
          "정기 활동 일정",
          "학기별 주요 활동 계획",
          "필요 기자재 및 예산",
        ],
      },
      {
        title: "구성원 계획",
        fields: ["모집 대상", "예상 인원", "구성원 역할 분담"],
      },
    ],
    notes: [
      "현재 다운로드는 페이지에 등록된 텍스트 양식을 내려받도록 구성했습니다.",
      "실제 HWP, PDF, DOCX 원본이 준비되면 동일한 목록 구조에서 파일 링크만 교체하면 됩니다.",
    ],
  },
];

export function getFormBySlug(slug: string) {
  return formItems.find((form) => form.slug === slug);
}

export function buildFormDownloadContent(form: FormItem) {
  const header = [
    "대동여지도 양식 모음",
    `양식명: ${form.title}`,
    `분류: ${form.category}`,
    `최종 업데이트: ${form.lastUpdated}`,
    "",
    form.summary,
    "",
  ];

  const sections = form.sections.flatMap((section) => [
    `[${section.title}]`,
    ...section.fields.map((field, index) => `${index + 1}. ${field}: `),
    "",
  ]);

  const footer = [
    "[안내]",
    ...form.notes.map((note, index) => `${index + 1}. ${note}`),
    "",
    "실제 제출용 문서가 배포되면 이 다운로드 파일은 원본 파일 링크로 교체됩니다.",
  ];

  return [...header, ...sections, ...footer].join("\n");
}
