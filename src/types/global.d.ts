import { PipelineFromServer } from "./pipeline";
import { ServerUser } from "./user";

declare global {
  interface Window {
    wpqt: {
      initialActivePipelineId: string | null;
      initialPipelines: PipelineFromServer[];
      apiNonce: string;
      initialUsers: ServerUser[];
      siteURL: string;
      publicUserPageId: string;
      timezone: string;
      isUserAllowedToDelete: "1" | "0";
    };
  }
}

export {};
