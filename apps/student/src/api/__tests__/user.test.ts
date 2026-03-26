import { apiClient } from "utils";
import { updateMyInfo, updateProfile } from "../user";

vi.mock("utils", () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const getFormValues = (formData: FormData, key: string) =>
  formData.getAll(key).map(String);

describe("user api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends deduped user profile arrays with the expected multipart keys", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { ok: true } });

    await updateProfile({
      introduction: "소개",
      majors: ["ETC", "ETC", "BE"],
      links: [" https://example.com ", "https://example.com", ""],
      profileImage: null,
    });

    const [, payload] = vi.mocked(apiClient.patch).mock.calls[0];
    const formData = payload as FormData;

    expect(formData).toBeInstanceOf(FormData);
    expect(getFormValues(formData, "majors")).toEqual(["ETC", "BE"]);
    expect(getFormValues(formData, "links")).toEqual(["https://example.com"]);
    expect(getFormValues(formData, "major")).toEqual([]);
    expect(getFormValues(formData, "link")).toEqual([]);
  });

  it("keeps my-info updates on the plural multipart field names", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { ok: true } });

    await updateMyInfo({
      introduction: "온보딩 소개",
      phoneNumber: "01012345678",
      majors: ["ETC"],
      links: ["https://portfolio.test"],
      profileImage: null,
    });

    const [, payload] = vi.mocked(apiClient.patch).mock.calls[0];
    const formData = payload as FormData;

    expect(getFormValues(formData, "majors")).toEqual(["ETC"]);
    expect(getFormValues(formData, "links")).toEqual([
      "https://portfolio.test",
    ]);
    expect(getFormValues(formData, "major")).toEqual([]);
    expect(getFormValues(formData, "link")).toEqual([]);
    expect(formData.get("phoneNumber")).toBe("01012345678");
  });
});
