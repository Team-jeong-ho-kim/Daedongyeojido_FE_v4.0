import { LandingHeader } from "ui";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main className="pt-16">{children}</main>
    </>
  );
}
