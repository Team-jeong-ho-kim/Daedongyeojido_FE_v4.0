"use client";

import { useState } from "react";
import { Button } from "ui";
import {
  FieldSelector,
  FormField,
  ImageUpload,
  LinkInput,
  TextArea,
  TextInput,
} from "@/components";
import { FIELDS } from "@/constants/club";

export default function ClubCreationPage() {
  const [clubName, setClubName] = useState("");
  const [clubLogo, setClubLogo] = useState<File | null>(null);
  const [clubIntro, setClubIntro] = useState("");
  const [clubLinks, setClubLinks] = useState<{ id: string; url: string }[]>([]);
  const [clubIntroDetail, setClubIntroDetail] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleSubmit = () => {
    console.log({
      clubName,
      clubLogo,
      clubIntro,
      clubLinks: clubLinks.map((link) => link.url),
      clubIntroDetail,
      selectedFields,
    });
  };

  return (
    <div className="mt-20 min-h-screen bg-white">
      <div className="bg-gray-50 py-16">
        <h1 className="mb-12 text-center font-bold text-[26px]">동아리 생성</h1>

        <div className="mx-auto max-w-[1200px] space-y-0 px-4">
          <FormField label="동아리 명">
            <TextInput
              value={clubName}
              onChange={setClubName}
              placeholder="동아리 명"
            />
          </FormField>

          <FormField label="동아리 로고">
            <ImageUpload onFileChange={(file) => setClubLogo(file)} />
          </FormField>

          <FormField label="동아리 한줄 소개">
            <TextInput
              value={clubIntro}
              onChange={setClubIntro}
              placeholder="동아리 한줄 소개를 작성해주세요."
            />
          </FormField>

          <FormField label="동아리 관련 링크" alignTop>
            <LinkInput links={clubLinks} onLinksChange={setClubLinks} />
          </FormField>

          <FormField label="동아리 소개 문구" alignTop>
            <TextArea
              value={clubIntroDetail}
              onChange={setClubIntroDetail}
              placeholder="동아리 소개 문구를 작성해주세요."
              rows={12}
            />
          </FormField>

          <FormField label="동아리 전공" alignTop>
            <FieldSelector
              fields={FIELDS}
              selectedFields={selectedFields}
              onSelectionChange={setSelectedFields}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-center py-16">
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-[500px] cursor-pointer rounded-lg bg-primary-500 py-6 font-medium text-[15px] text-white transition-colors hover:bg-[#FF6B6B]"
        >
          개설 신청
        </Button>
      </div>
    </div>
  );
}
