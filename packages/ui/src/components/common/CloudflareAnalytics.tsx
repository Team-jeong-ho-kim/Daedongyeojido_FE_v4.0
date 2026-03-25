import Script from "next/script";

type CloudflareAnalyticsProps = {
  token?: string;
};

export function CloudflareAnalytics({ token }: CloudflareAnalyticsProps) {
  const normalizedToken = token?.trim();

  if (!normalizedToken) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: normalizedToken })}
    />
  );
}
