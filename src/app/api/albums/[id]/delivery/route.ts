import { NextResponse } from "next/server";
import { deliveryToken, newId } from "@/lib/id";
import { loadStore, mutateStore } from "@/lib/store";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const store = await loadStore();
  const session = store.deliverySessions.find((s) => s.albumId === id);
  return NextResponse.json({ session: session ?? null });
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as { pin?: string; clientEmail?: string };

  let token = "";
  await mutateStore((store) => {
    const album = store.albums.find((a) => a.id === id);
    if (!album) return;

    let session = store.deliverySessions.find((s) => s.albumId === id);
    if (!session) {
      token = deliveryToken();
      session = {
        id: newId(),
        albumId: id,
        token,
        pin: body.pin,
        clientEmail: body.clientEmail,
        createdAt: new Date().toISOString(),
      };
      store.deliverySessions.push(session);
    } else {
      token = session.token;
      if (body.pin !== undefined) session.pin = body.pin;
      if (body.clientEmail !== undefined) session.clientEmail = body.clientEmail;
    }
  });

  if (!token) return NextResponse.json({ error: "Album not found" }, { status: 404 });
  return NextResponse.json({ token });
}
