import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "ui";
import { formItems } from "@/components/forms/data";

export const metadata: Metadata = {
  title: "양식 모음",
  description:
    "대동여지도에서 전공동아리 관련 양식을 한 곳에서 조회하고 다운로드하세요.",
};

export default function FormsPage() {
  return (
    <main className="min-h-screen bg-[#fffdfd] text-[#28191b]">
      <section className="border-[#f5dede] border-b bg-[linear-gradient(180deg,#fff6f6_0%,#fffdfd_100%)] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex rounded-full bg-[#ffe5e5] px-4 py-1.5 font-semibold text-[#f45f5f] text-sm">
            Form Archive
          </span>
          <h1 className="mt-5 max-w-3xl font-bold text-4xl leading-tight md:text-5xl">
            필요한 양식을 한 곳에서
            <br />
            바로 조회하고 내려받으세요
          </h1>
          <p className="mt-5 max-w-2xl text-[#6c6768] text-base leading-7 md:text-lg">
            현재는 동아리 개설 신청 양식을 우선 제공하고 있습니다. 이후 추가되는
            양식도 같은 페이지에서 계속 확장할 수 있도록 구조를 정리해
            두었습니다.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6">
          {formItems.map((form) => (
            <article
              key={form.slug}
              className="overflow-hidden rounded-[28px] border border-[#f1dede] bg-white shadow-[0_24px_80px_rgba(115,56,56,0.08)]"
            >
              <div className="grid gap-8 px-6 py-7 md:px-8 md:py-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#fff1f1] px-3 py-1 font-semibold text-[#f45f5f] text-sm">
                      {form.category}
                    </span>
                    <span className="text-[#9b8f91] text-sm">
                      업데이트 {form.lastUpdated}
                    </span>
                  </div>
                  <h2 className="mt-4 font-bold text-2xl md:text-3xl">
                    {form.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[#5f5759] leading-7">
                    {form.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {form.sections.map((section) => (
                      <span
                        key={section.title}
                        className="rounded-full border border-[#ead7d7] px-3 py-1 text-[#6c6768] text-sm"
                      >
                        {section.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#fff8f8] p-5 md:p-6">
                  <p className="font-semibold text-[#3d3133] text-sm">
                    포함 항목
                  </p>
                  <ul className="mt-4 space-y-3 text-[#5f5759] text-sm leading-6">
                    {form.sections.slice(0, 3).map((section) => (
                      <li key={section.title}>
                        <span className="font-semibold text-[#28191b]">
                          {section.title}
                        </span>
                        <span> · {section.fields.slice(0, 3).join(" · ")}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/forms/${form.slug}`}
                      className="inline-flex items-center justify-center rounded-2xl bg-[#f45f5f] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-85"
                    >
                      양식 조회
                    </Link>
                    <a
                      href={`/forms/${form.slug}/download`}
                      className="inline-flex items-center justify-center rounded-2xl border border-[#f2caca] bg-white px-5 py-3 font-semibold text-[#d94f57] transition-colors hover:bg-[#fff4f4]"
                    >
                      다운로드
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
