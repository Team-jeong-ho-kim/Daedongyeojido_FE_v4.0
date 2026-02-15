/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_USER_URL || "http://localhost:3001",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/mypage/*", "/api/*", "/login"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/mypage/", "/api/"],
      },
    ],
    additionalSitemaps: [],
    transformRobotsTxt: async (_, robotsTxt) => {
      // Remove Host directive (not supported by Googlebot)
      return robotsTxt.replace(/# Host\nHost: .*\n\n/g, "");
    },
  },
};
