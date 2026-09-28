"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/config";

export function BrandLogo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const sources = useMemo(
    () =>
      Array.from(
        new Set([
          siteConfig.logoPath,
          "/Hop.png",
          "/hop.png",
          "/images/Hop.png",
          "/images/hop.png",
          "/Hop.svg",
        ])
      ),
    []
  );

  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const source = sources[sourceIndex];

  function tryNextSource() {
    setLoaded(false);
    setSourceIndex((current) => current + 1);
  }

  const exhausted = sourceIndex >= sources.length;

  return (
    <span
      className={`brand-logo ${compact ? "brand-logo-compact" : ""} ${className}`.trim()}
      aria-label={siteConfig.companyName}
    >
      {!exhausted ? (
        <img
          src={source}
          alt={siteConfig.companyName}
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={tryNextSource}
        />
      ) : null}

      {(!loaded || exhausted) ? (
        <span className="brand-logo-fallback" aria-hidden={!exhausted}>
          <b>HOPE</b>
          <small>BUSINESS</small>
        </span>
      ) : null}
    </span>
  );
}
