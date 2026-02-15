/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [],
    transformRobotsTxt: async (_, robotsTxt) => {
      // Remove Host directive (not supported by Googlebot)
      return robotsTxt.replace(/# Host\nHost: .*\n\n/g, "");
    },
  },
};
