import type {
  Album,
  ClientPickSubmission,
  DeliverySession,
  Workspace,
} from "@/types/album";
import type { SiteBuilderConfig } from "@/types/site";

export type VegaStore = {
  workspace: Workspace;
  albums: Album[];
  deliverySessions: DeliverySession[];
  picks: Record<string, ClientPickSubmission>;
  site: SiteBuilderConfig;
};
