import { useState } from "react";
import { BadgeManifest } from "../../hooks/services/backend/useBadgeService.ts";
import { BadgeClaimAuthorization } from "./BadgeClaimAuthorization.tsx";
import { BadgeIssuerAppBrowser } from "./BadgeIssuerAppBrowser.tsx";

export interface AuthInfo {
  message?: string;
  signature?: string;
  timestamp?: string;
}

export function BadgeSheetContent({ badge }: { badge: string }) {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({});
  const [manifest, setManifest] = useState<BadgeManifest | undefined>();

  if (!authInfo.signature) {
    return (
      <BadgeClaimAuthorization
        badge={badge}
        setAuthInfo={setAuthInfo}
        setManifest={setManifest}
      />
    );
  }

  return <BadgeIssuerAppBrowser badge={badge} manifest={manifest} authInfo={authInfo} />;
}
