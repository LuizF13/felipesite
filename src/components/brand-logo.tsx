"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";

export function BrandLogo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`brand-logo ${compact ? "brand-logo-compact" : ""} ${className}`.trim()}>
      {!failed ? (
        <img
          src={siteConfig.logoPath}
          alt={siteConfig.companyName}
          onError={() => setFailed(true)}
        />
      ) : null}
      {failed ? <span>{siteConfig.companyName}</span> : null}
    </span>
  );
}
