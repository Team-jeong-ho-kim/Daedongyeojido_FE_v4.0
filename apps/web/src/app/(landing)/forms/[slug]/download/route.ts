import {
  buildFormDownloadContent,
  getFormBySlug,
} from "@/components/forms/data";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const form = getFormBySlug(slug);

  if (!form) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const content = buildFormDownloadContent(form);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(form.fileName)}`,
      "Cache-Control": "no-store",
    },
  });
}
