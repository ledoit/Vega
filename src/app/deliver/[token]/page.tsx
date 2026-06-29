import { DeliverClient } from "@/components/deliver/DeliverClient";

type PageProps = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Your gallery — Vega",
  description: "Select your favorite photographs",
};

export default async function DeliverPage({ params }: PageProps) {
  const { token } = await params;
  return <DeliverClient token={token} />;
}
