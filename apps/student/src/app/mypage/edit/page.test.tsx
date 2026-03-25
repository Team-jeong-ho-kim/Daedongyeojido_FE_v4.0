import { fireEvent, render, screen } from "@testing-library/react";
import MyPageEdit from "./page";

const pageMocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  useUpdateProfileMutation: vi.fn(),
  useUserStore: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: () => <div data-testid="mock-image" />,
}));

vi.mock("shared", async (importOriginal) => {
  const actual = await importOriginal<typeof import("shared")>();

  return {
    ...actual,
    useUserStore: pageMocks.useUserStore,
  };
});

vi.mock("@/hooks/mutations/useUser", () => ({
  useUpdateProfileMutation: pageMocks.useUpdateProfileMutation,
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("ui", () => ({
  FieldSelector: ({
    error,
    fields,
    onSelectionChange,
    selectedFields,
  }: {
    error?: string;
    fields: string[];
    onSelectionChange: (fields: string[]) => void;
    selectedFields: string[];
  }) => (
    <div>
      <button onClick={() => onSelectionChange([])} type="button">
        전공 전체 해제
      </button>
      <button onClick={() => onSelectionChange([fields[0]])} type="button">
        전공 하나 선택
      </button>
      <div>선택 전공 수:{selectedFields.length}</div>
      {error ? <p>{error}</p> : null}
    </div>
  ),
  ImageUpload: () => <div>image upload</div>,
  LinkInput: () => <div>link input</div>,
  TextInput: ({
    onChange,
    value,
  }: {
    onChange: (value: string) => void;
    value: string;
  }) => (
    <input
      aria-label="한 줄 소개"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  ),
}));

describe("MyPageEdit", () => {
  beforeEach(() => {
    Object.values(pageMocks).forEach((mock) => {
      mock.mockReset();
    });

    pageMocks.useUserStore.mockImplementation((selector) =>
      selector({
        userInfo: {
          classNumber: "2401",
          clubName: "테스트 동아리",
          introduction: "안녕하세요",
          link: ["https://daedong.test"],
          major: ["FE"],
          profileImage: "/images/icons/profile.svg",
          role: "STUDENT",
          userName: "홍길동",
        },
      }),
    );

    pageMocks.useUpdateProfileMutation.mockReturnValue({
      isPending: false,
      mutate: pageMocks.mutate,
    });
  });

  it("blocks submit when all majors are removed", () => {
    render(<MyPageEdit />);

    fireEvent.click(screen.getByRole("button", { name: "전공 전체 해제" }));
    fireEvent.click(screen.getByRole("button", { name: "변경 하기" }));

    expect(pageMocks.mutate).not.toHaveBeenCalled();
    expect(screen.getByText("전공을 1개 이상 선택해주세요")).toBeVisible();
  });

  it("clears the major error when a major is selected again", () => {
    render(<MyPageEdit />);

    fireEvent.click(screen.getByRole("button", { name: "전공 전체 해제" }));
    fireEvent.click(screen.getByRole("button", { name: "변경 하기" }));

    expect(screen.getByText("전공을 1개 이상 선택해주세요")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "전공 하나 선택" }));

    expect(
      screen.queryByText("전공을 1개 이상 선택해주세요"),
    ).not.toBeInTheDocument();
  });
});
