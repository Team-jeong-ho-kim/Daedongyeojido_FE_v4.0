import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "ui";
import LayoutContent from "@/components/layout/LayoutContent";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_USER_URL || "https://student.daedongyeojido.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "대동여지도 - 나의 동아리를 찾는 지름길",
    template: "%s | 대동여지도",
  },
  description:
    "대동여지도는 대덕소프트웨어마이스터고 학생들이 자신에게 맞는 전공동아리를 쉽게 찾고 지원할 수 있도록 돕는 플랫폼입니다. 동아리 정보 조회, 온라인 지원, 면접 일정 관리까지 한 곳에서 간편하게 이용하세요.",
  keywords: [
    "대동여지도",
    "동아리",
    "전공동아리",
    "대덕소프트웨어마이스터고",
    "대마고",
    "동아리 지원",
    "동아리 활동",
    "학생 동아리",
    "동아리 관리",
    "동아리 모집",
    "면접 일정",
  ],
  authors: [{ name: "대동여지도", url: siteUrl }],
  creator: "대동여지도",
  publisher: "대동여지도",
  verification: {
    google: "hf7Wmpstr3d6XCpt2EfJVsv7Z_DPRu7TwU6OPpNOcDU",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "대동여지도",
    title: "대동여지도 - 나의 동아리를 찾는 지름길",
    description:
      "대덕소프트웨어마이스터고 전공동아리를 쉽게 찾고 지원할 수 있는 플랫폼입니다. 동아리 정보 조회, 온라인 지원, 면접 일정 관리까지 한 곳에서 간편하게 이용하세요.",
  },
  twitter: {
    card: "summary",
    title: "대동여지도 - 나의 동아리를 찾는 지름길",
    description:
      "대덕소프트웨어마이스터고 전공동아리를 쉽게 찾고 지원할 수 있는 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/daedong.svg",
    apple: "/daedong.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "대동여지도",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/daedong.svg`,
        },
        description: "대덕소프트웨어마이스터고 전공동아리 관리 플랫폼",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: "Korean",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "대동여지도",
        description:
          "대덕소프트웨어마이스터고 전공동아리를 쉽게 찾고 지원할 수 있는 플랫폼",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "ko-KR",
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "대동여지도 - 나의 동아리를 찾는 지름길",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "대덕소프트웨어마이스터고 전공동아리를 쉽게 찾고 지원할 수 있는 플랫폼입니다. 동아리 정보 조회, 온라인 지원, 면접 일정 관리까지 한 곳에서 간편하게 이용하세요.",
        inLanguage: "ko-KR",
      },
    ],
  };

  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data with XSS protection
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <QueryProvider>
          <UserProvider>
            <Toaster position="top-right" duration={3000} richColors />
            <LayoutContent>
              <main>{children}</main>
            </LayoutContent>
            <Footer />
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
