export const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
  window.location.href = `${webUrl}/login`;
};
