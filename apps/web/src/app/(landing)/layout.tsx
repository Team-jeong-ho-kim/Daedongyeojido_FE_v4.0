import { LandingHeader } from "@/components/LandingHeader";

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
