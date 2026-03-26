import { render, screen } from "@testing-library/react";
import { ImageCarousel } from "../ImageCarousel";

describe("ImageCarousel", () => {
  it("keeps arrow controls inside the carousel on mobile and offset on desktop", () => {
    render(<ImageCarousel />);

    const previousButton = screen.getByRole("button", {
      name: "이전 슬라이드",
    });
    const nextButton = screen.getByRole("button", {
      name: "다음 슬라이드",
    });

    expect(previousButton).toHaveClass("left-2", "md:-left-14", "z-10");
    expect(nextButton).toHaveClass("right-2", "md:-right-14", "z-10");
  });
});
