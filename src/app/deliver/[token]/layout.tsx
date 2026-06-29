export const metadata = {
  title: "Your gallery — Vega",
};

export default function DeliverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-paper">
      <main id="main">{children}</main>
    </div>
  );
}
