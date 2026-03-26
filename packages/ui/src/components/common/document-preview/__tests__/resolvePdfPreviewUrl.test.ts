import { resolvePdfPreviewUrl } from "../resolvePdfPreviewUrl";

const createMockResponse = (
  response: {
    blob?: () => Promise<Blob>;
    headers?: {
      get: (name: string) => string | null;
    };
    ok: boolean;
  },
) => {
  return response as unknown as Response;
};

describe("resolvePdfPreviewUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns inline blob urls without fetching", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const result = await resolvePdfPreviewUrl("blob:test-pdf");

    expect(result).toEqual({
      message: null,
      revoke: null,
      url: "blob:test-pdf",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns an error when the fetch response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(createMockResponse({
      ok: false,
    }));

    await expect(resolvePdfPreviewUrl("/documents/404.pdf")).resolves.toEqual({
      message: "PDF 미리보기를 불러오지 못했습니다.",
      revoke: null,
      url: null,
    });
  });

  it("validates the PDF signature before creating an object url", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(createMockResponse({
      blob: () => Promise.resolve(new Blob(["not a pdf"])),
      headers: {
        get: () => "application/pdf",
      },
      ok: true,
    }));

    await expect(resolvePdfPreviewUrl("/documents/text.pdf")).resolves.toEqual({
      message: "PDF 미리보기를 불러오지 못했습니다.",
      revoke: null,
      url: null,
    });
  });

  it("returns an object url for a valid pdf response", async () => {
    const pdfBlob = {
      size: 6,
      slice: () => ({
        arrayBuffer: () =>
          Promise.resolve(
            new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]).buffer,
          ),
      }),
      type: "application/pdf",
    } as unknown as Blob;

    vi.spyOn(globalThis, "fetch").mockResolvedValue(createMockResponse({
      blob: () => Promise.resolve(pdfBlob),
      headers: {
        get: () => "application/pdf",
      },
      ok: true,
    }));

    const result = await resolvePdfPreviewUrl("/documents/form.pdf");

    expect(result.message).toBeNull();
    expect(result.url).toBe("blob:test-object-url");
    expect(result.revoke).toEqual(expect.any(Function));

    result.revoke?.();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test-object-url");
  });
});
