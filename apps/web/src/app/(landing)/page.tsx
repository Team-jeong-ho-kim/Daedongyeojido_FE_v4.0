import Image from "next/image";
import Link from "next/link";
import { Footer } from "ui";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { mobileCards } from "@/components/landing/data";
import { FloatingCards } from "@/components/landing/FloatingCards";
import { ImageCarousel } from "@/components/landing/ImageCarousel";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-white">
      <div className="absolute top-[70px] left-0 h-[1000px] w-full bg-gradient-to-b from-transparent via-red-50/10 to-white md:h-[1500px]" />

      <AnimatedSection className="relative flex flex-col items-center gap-12 px-4 pt-24 pb-8 md:gap-20 md:pt-32 lg:pt-40">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 font-bold text-3xl text-black leading-tight tracking-tight md:mb-8 md:text-5xl md:leading-tight lg:text-6xl">
            <span className="block">동아리의 모든 것</span>
            <span className="block">대동여지도에서 쉽고 간편하게</span>
          </h1>
          <Link
            href={`${process.env.NEXT_PUBLIC_USER_URL}/login`}
            className="rounded-2xl bg-[#f0e5e5] px-6 py-3 font-bold text-[#4a4444] text-base transition-colors hover:bg-[#e5d5d5] md:px-8 md:py-4 md:text-lg"
          >
            로그인 하기
          </Link>
        </div>

        <ImageCarousel />

        <Image
          src="/images/landing/arrow.png"
          alt="scroll"
          width={40}
          height={12}
          className="mt-4 animate-bounce opacity-50"
        />
      </AnimatedSection>

      <AnimatedSection className="bg-[#fbf9fa] px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold text-[#28191b] text-lg leading-relaxed md:text-2xl md:leading-relaxed lg:text-3xl lg:leading-relaxed">
            대덕소프트웨어마이스터고등학교의
            <br className="sm:hidden" /> 전공동아리들을
            <br />
            한눈에 조회하고 한 곳에서 관리하세요.
            <br />
            <span className="text-[#ff4a50]">
              이제껏 경험 못 했던 쉽고 편리한
              <br className="sm:hidden" /> 전공동아리 서비스,
            </span>
            <br />
            대동여지도와 함께라면
            <br className="sm:hidden" /> 당신의 전공동아리가 새로워질 거예요.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-4 py-16 text-center md:py-24 lg:py-32">
        <h2 className="font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">
          <span className="block text-[#28191b]">전공동아리</span>
          <span className="block text-[#ff4d62]">관리의 모든 것</span>
          <span className="block text-[#28191b]">하나로 관리하다</span>
        </h2>
      </AnimatedSection>

      <FloatingCards />

      <section className="px-4 py-8 lg:hidden">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
          {mobileCards.map((card) => (
            <div key={card.alt} className="flex-shrink-0">
              <Image
                src={card.src}
                alt={card.alt}
                width={150}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <AnimatedSection className="mb-20 md:mb-32">
          <p className="mb-2 font-bold text-[#ff4a50] text-xl md:mb-4 md:text-2xl">
            등록 · 생성
          </p>
          <h3 className="mb-8 font-bold text-3xl text-black leading-tight md:mb-12 md:text-4xl lg:text-5xl">
            <span className="block">동아리 관리,</span>
            <span className="block">등록부터 생성까지</span>
            <span className="block">간편하게</span>
          </h3>
          <div className="flex justify-center">
            <Image
              src="/images/landing/mac2.png"
              alt="동아리 관리 화면"
              width={900}
              height={545}
              className="w-full max-w-3xl rounded-lg"
            />
          </div>
          <p className="mt-8 text-end font-medium text-[#6c6768] text-base md:mt-12 md:text-xl">
            <span className="block">클릭 한 번으로 전공 동아리를</span>
            <span className="block">쉽게 생성할 수 있어요.</span>
          </p>
        </AnimatedSection>

        <AnimatedSection className="mb-20 md:mb-32">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-2 flex items-center gap-2 md:mb-4">
                <Image
                  src="/images/icons/question.png"
                  alt=""
                  width={18}
                  height={16}
                />
                <p className="font-bold text-[#ff4a50] text-lg md:text-xl">
                  전공동아리 공고
                </p>
              </div>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">여러 전공동아리 공고를</span>
                <span className="block">한 눈에 확인하세요</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                대덕SW고의 전공동아리 공고를
                <br />
                쉽고 빠르게 확인할 수 있어요
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Image
                src="/images/landing/page1.png"
                alt="공고 화면 1"
                width={500}
                height={310}
                className="w-full rounded-lg shadow-md"
              />
              <Image
                src="/images/landing/page2.png"
                alt="공고 화면 2"
                width={400}
                height={280}
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-20 md:mb-32">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 lg:order-1">
              <Image
                src="/images/landing/page3.png"
                alt="지원 관리 화면"
                width={550}
                height={410}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-2 flex items-center gap-2 md:mb-4">
                <Image
                  src="/images/landing/article.png"
                  alt=""
                  width={18}
                  height={16}
                />
                <p className="font-bold text-[#ff4a50] text-lg md:text-xl">
                  지원 관리
                </p>
              </div>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">전공동아리 지원 내역을</span>
                <span className="block">한 눈에 확인해보세요.</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                마이페이지에서 자신이 지원한
                <br />
                전공동아리를 쉽고 간편하게 확인할 수 있어요
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-2 font-bold text-[#ff4a50] text-lg md:mb-4 md:text-xl">
                우리의 시간은 소중하니까
              </p>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">복잡하고 귀찮은</span>
                <span className="block">일들과 작별해보세요</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                큐알 코드가 붙은 포스터, 동아리 정보들
                <br />
                면접 일정 관리, 공지, 합격 결과 알리기
                <br />
                <br />
                대동여지도와 함께라면 더이상 번거롭지 않아요
              </p>
            </div>
            <div>
              <Image
                src="/images/icons/calender.png"
                alt="달력"
                width={500}
                height={610}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </main>
  );
}
