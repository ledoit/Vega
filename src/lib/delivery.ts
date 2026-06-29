export const DELIVERY_STATE_LABELS = {
  draft: "Draft — curating",
  ready_to_pick: "Ready to pick",
  picked: "Picked — retouch",
  finalized: "Finals ready",
} as const;

export function deliveryPath(token: string): string {
  return `/deliver/${token}`;
}

export function absoluteDeliverUrl(token: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${deliveryPath(token)}`;
  }
  return deliveryPath(token);
}
