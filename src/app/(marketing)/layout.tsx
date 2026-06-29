import { ProductHeader } from "@/components/layout/ProductHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProductHeader />
      <main id="main">{children}</main>
    </>
  );
}
