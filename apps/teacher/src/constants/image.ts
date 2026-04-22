export const ALLOWED_IMAGE_HOSTS = new Set([
  "dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com",
  "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
]);

export const isRenderableImageSrc = (value: string) => {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
};
