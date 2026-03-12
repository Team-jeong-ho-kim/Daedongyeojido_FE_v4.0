import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "ui";
import { getFormBySlug } from "@/components/forms/data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const form = getFormBySlug(slug);

  if (!form) {
    return {
      title: "양식을 찾을 수 없습니다",
    };
  }

  return {
    title: `${form.title} 조회`,
    description: form.summary,
  };
}

export default async function FormDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const form = getFormBySlug(slug);

  if (!form) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fffdfd] text-[#28191b]">
      <section className="border-[#f5dede] border-b bg-[linear-gradient(180deg,#fff9f9_0%,#fffdfd_100%)] px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/forms"
            className="text-[#b36d74] text-sm transition-colors hover:text-[#f45f5f]"
          >
            양식 모음 / 목록으로 돌아가기
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#fff0f0] px-3 py-1 font-semibold text-[#f45f5f] text-sm">
              {form.category}
            </span>
            <span className="text-[#9b8f91] text-sm">
              업데이트 {form.lastUpdated}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-bold text-4xl leading-tight md:text-5xl">
            {form.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[#5f5759] text-base leading-7 md:text-lg">
            {form.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`/forms/${form.slug}/download`}
              className="inline-flex items-center justify-center rounded-2xl bg-[#f45f5f] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-85"
            >
              양식 다운로드
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-[#f2caca] bg-white px-6 py-3 font-semibold text-[#d94f57] transition-colors hover:bg-[#fff4f4]"
            >
              서비스 바로가기
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-[#f1dede] bg-white p-6 shadow-[0_24px_80px_rgba(115,56,56,0.08)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-bold text-2xl">양식 미리보기</h2>
              <span className="rounded-full bg-[#fff7f7] px-3 py-1 text-[#9b6d72] text-sm">
                조회 전용
              </span>
            </div>

            <div className="mt-8 space-y-6">
              {form.sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[24px] bg-[#fff9f9] p-5"
                >
                  <h3 className="font-semibold text-[#28191b] text-lg">
                    {section.title}
                  </h3>
                  <ul className="mt-4 grid gap-3 md:grid-cols-2">
                    {section.fields.map((field) => (
                      <li
                        key={field}
                        className="rounded-2xl border border-[#f0dede] bg-white px-4 py-3 text-[#5f5759]"
                      >
                        {field}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[#f1dede] bg-[#fff8f8] p-6">
              <h2 className="font-bold text-xl">안내</h2>
              <ul className="mt-4 space-y-3 text-[#5f5759] leading-7">
                {form.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-[#f1dede] bg-white p-6">
              <h2 className="font-bold text-xl">다운로드 정보</h2>
              <dl className="mt-4 space-y-4 text-[#5f5759]">
                <div>
                  <dt className="font-semibold text-[#28191b]">파일명</dt>
                  <dd className="mt-1 break-all">{form.fileName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#28191b]">형식</dt>
                  <dd className="mt-1">텍스트 기반 임시 양식</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#28191b]">비고</dt>
                  <dd className="mt-1">
                    추후 실제 원본 파일이 전달되면 다운로드 대상만 교체하면
                    됩니다.
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
