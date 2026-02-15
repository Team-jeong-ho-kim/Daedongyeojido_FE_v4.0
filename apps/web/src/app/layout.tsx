import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_WEB_URL || "https://dsm.daedongyeojido.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "대동여지도 - 나의 동아리를 찾는 지름길",
    template: "%s | 대동여지도",
  },
  description:
    "동아리의 모든 것을 대동여지도에서 쉽고 간편하게. 대덕소프트웨어마이스터고 전공동아리 관리, 모집 공고, 지원 관리까지 한 곳에서 해결하세요.",
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
    "동아리 생성",
    "지원서 관리",
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
    title: "대동여지도 - 동아리의 모든 것을 한 곳에서",
    description:
      "대덕소프트웨어마이스터고 전공동아리 관리, 모집 공고, 지원 관리까지. 이제껏 경험 못 했던 쉽고 편리한 전공동아리 서비스.",
  },
  twitter: {
    card: "summary",
    title: "대동여지도 - 동아리의 모든 것을 한 곳에서",
    description:
      "대덕소프트웨어마이스터고 전공동아리 관리, 모집 공고, 지원 관리까지",
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
          "동아리의 모든 것을 한 곳에서. 전공동아리 관리, 모집 공고, 지원 관리까지",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "ko-KR",
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: "대동여지도 - 동아리의 모든 것을 한 곳에서",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "대덕소프트웨어마이스터고 전공동아리 관리, 모집 공고, 지원 관리까지. 이제껏 경험 못 했던 쉽고 편리한 전공동아리 서비스.",
        inLanguage: "ko-KR",
      },
    ],
  };

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/daedong.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data with XSS protection
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
