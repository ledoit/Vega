import { AlbumEditor } from "@/components/admin/AlbumEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlbumPage({ params }: PageProps) {
  const { id } = await params;
  return <AlbumEditor albumId={id} />;
}
