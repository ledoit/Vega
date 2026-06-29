import { SiteHeader } from "@/components/layout/SiteHeader";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
    </>
  );
}
