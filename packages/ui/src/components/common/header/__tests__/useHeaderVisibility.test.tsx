import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useHeaderVisibility } from "../useHeaderVisibility";

describe("useHeaderVisibility", () => {
  const setScrollY = (value: number) => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value,
      writable: true,
    });
  };

  it("hides the header when scrolling down and shows it when scrolling up", () => {
    const { result } = renderHook(() => useHeaderVisibility());

    expect(result.current).toBe(true);

    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);

    act(() => {
      setScrollY(20);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });
});
