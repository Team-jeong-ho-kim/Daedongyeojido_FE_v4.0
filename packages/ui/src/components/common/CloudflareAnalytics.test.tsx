import { render } from "@testing-library/react";
import type { ScriptHTMLAttributes } from "react";
import { CloudflareAnalytics } from "./CloudflareAnalytics";

vi.mock("next/script", () => ({
  default: (props: ScriptHTMLAttributes<HTMLScriptElement>) => (
    <script {...props} />
  ),
}));

describe("CloudflareAnalytics", () => {
  it("renders the Cloudflare beacon script when a token is provided", () => {
    const { container } = render(<CloudflareAnalytics token=" test-token " />);
    const script = container.querySelector("script");

    expect(script).not.toBeNull();
    expect(script).toHaveAttribute(
      "src",
      "https://static.cloudflareinsights.com/beacon.min.js",
    );
    expect(script).toHaveAttribute(
      "data-cf-beacon",
      JSON.stringify({ token: "test-token" }),
    );
  });

  it("does not render the script when the token is blank", () => {
    const { container } = render(<CloudflareAnalytics token="   " />);

    expect(container.querySelector("script")).toBeNull();
  });

  it("does not render the script when the token is missing", () => {
    const { container } = render(<CloudflareAnalytics />);

    expect(container.querySelector("script")).toBeNull();
  });
});
