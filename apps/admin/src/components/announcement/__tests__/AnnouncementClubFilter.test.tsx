import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnnouncementClubFilter,
  type AnnouncementClubFilterOption,
} from "../AnnouncementClubFilter";

const clubOptions: AnnouncementClubFilterOption[] = [
  { imageUrl: null, name: "전체" },
  { imageUrl: null, name: "대동여지도" },
  { imageUrl: null, name: "DMS" },
  { imageUrl: null, name: "Plain" },
];

const setScrollMetrics = (
  element: HTMLDivElement,
  {
    clientWidth,
    scrollWidth,
    scrollLeft = 0,
  }: {
    clientWidth: number;
    scrollLeft?: number;
    scrollWidth: number;
  },
) => {
  let currentScrollLeft = scrollLeft;

  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });
  Object.defineProperty(element, "scrollLeft", {
    configurable: true,
    get: () => currentScrollLeft,
    set: (value: number) => {
      currentScrollLeft = value;
    },
  });

  const scrollTo = vi.fn(({ left }: { behavior: string; left: number }) => {
    currentScrollLeft = left;
  });

  Object.defineProperty(element, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });

  return {
    scrollTo,
    setScrollLeft: (value: number) => {
      currentScrollLeft = value;
    },
  };
};

describe("AnnouncementClubFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides arrow buttons when the filter does not overflow", () => {
    render(
      <AnnouncementClubFilter
        clubOptions={clubOptions}
        selectedClub="전체"
        onSelectClub={vi.fn()}
      />,
    );

    const scrollContainer = screen.getByTestId(
      "announcement-club-filter-scroll",
    ) as HTMLDivElement;

    setScrollMetrics(scrollContainer, {
      clientWidth: 640,
      scrollWidth: 640,
    });

    fireEvent(window, new Event("resize"));

    expect(
      screen.queryByRole("button", { name: "이전 동아리 필터 보기" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "다음 동아리 필터 보기" }),
    ).not.toBeInTheDocument();
  });

  it("shows only the right arrow on initial render when the filter overflows", () => {
    render(
      <AnnouncementClubFilter
        clubOptions={clubOptions}
        selectedClub="전체"
        onSelectClub={vi.fn()}
      />,
    );

    const scrollContainer = screen.getByTestId(
      "announcement-club-filter-scroll",
    ) as HTMLDivElement;

    setScrollMetrics(scrollContainer, {
      clientWidth: 220,
      scrollWidth: 640,
    });

    fireEvent(window, new Event("resize"));

    expect(
      screen.queryByRole("button", { name: "이전 동아리 필터 보기" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다음 동아리 필터 보기" }),
    ).toBeVisible();
  });

  it("scrolls smoothly to the right when the right arrow is clicked", () => {
    render(
      <AnnouncementClubFilter
        clubOptions={clubOptions}
        selectedClub="전체"
        onSelectClub={vi.fn()}
      />,
    );

    const scrollContainer = screen.getByTestId(
      "announcement-club-filter-scroll",
    ) as HTMLDivElement;

    const { scrollTo } = setScrollMetrics(scrollContainer, {
      clientWidth: 300,
      scrollWidth: 820,
    });

    fireEvent(window, new Event("resize"));
    fireEvent.click(
      screen.getByRole("button", { name: "다음 동아리 필터 보기" }),
    );

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      left: 210,
    });
  });

  it("shows the left arrow after the user scrolls to the middle", () => {
    render(
      <AnnouncementClubFilter
        clubOptions={clubOptions}
        selectedClub="전체"
        onSelectClub={vi.fn()}
      />,
    );

    const scrollContainer = screen.getByTestId(
      "announcement-club-filter-scroll",
    ) as HTMLDivElement;

    const { setScrollLeft } = setScrollMetrics(scrollContainer, {
      clientWidth: 240,
      scrollWidth: 700,
    });

    fireEvent(window, new Event("resize"));

    setScrollLeft(180);
    fireEvent.scroll(scrollContainer);

    expect(
      screen.getByRole("button", { name: "이전 동아리 필터 보기" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "다음 동아리 필터 보기" }),
    ).toBeVisible();
  });

  it("hides the right arrow when the user reaches the end", () => {
    render(
      <AnnouncementClubFilter
        clubOptions={clubOptions}
        selectedClub="전체"
        onSelectClub={vi.fn()}
      />,
    );

    const scrollContainer = screen.getByTestId(
      "announcement-club-filter-scroll",
    ) as HTMLDivElement;

    const { setScrollLeft } = setScrollMetrics(scrollContainer, {
      clientWidth: 240,
      scrollWidth: 700,
    });

    fireEvent(window, new Event("resize"));

    setScrollLeft(460);
    fireEvent.scroll(scrollContainer);

    expect(
      screen.getByRole("button", { name: "이전 동아리 필터 보기" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "다음 동아리 필터 보기" }),
    ).not.toBeInTheDocument();
  });
});
