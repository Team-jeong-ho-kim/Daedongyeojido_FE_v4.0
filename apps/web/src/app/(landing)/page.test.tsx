import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("@/components/landing", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  ),
  FloatingCards: () => <div>floating cards</div>,
  ImageCarousel: () => <div>image carousel</div>,
  mobileCards: [],
}));

vi.mock("ui", () => ({
  Footer: () => <footer>footer</footer>,
}));

describe("landing page", () => {
  it("renders the hero copy and login link", () => {
    render(<Home />);

    expect(screen.getByText("동아리의 모든 것")).toBeVisible();
    expect(screen.getByRole("link", { name: "로그인 하기" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
