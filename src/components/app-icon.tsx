import type { SVGProps } from "react";

type IconName =
  | "dashboard"
  | "building"
  | "plus"
  | "users"
  | "external"
  | "logout"
  | "check"
  | "clock"
  | "sold"
  | "lead"
  | "play"
  | "pause"
  | "volume"
  | "mute"
  | "fullscreen";

export function AppIcon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg {...common}>
        <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" />
        <path d="M17 9h2a2 2 0 0 1 2 2v10" />
        <path d="M8 7h5M8 11h5M8 15h5M9 21v-2h3v2" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }

  if (name === "users" || name === "lead") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M17 11l2 2 3-4" />
      </svg>
    );
  }

  if (name === "external") {
    return (
      <svg {...common}>
        <path d="M14 3h7v7" />
        <path d="M10 14L21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "sold") {
    return (
      <svg {...common}>
        <path d="M5 3h14a2 2 0 0 1 2 2v6H3V5a2 2 0 0 1 2-2Z" />
        <path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" />
        <path d="M8 16h8" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg {...common}>
        <path d="m8 5 11 7-11 7V5Z" />
      </svg>
    );
  }

  if (name === "pause") {
    return (
      <svg {...common}>
        <path d="M8 5v14M16 5v14" />
      </svg>
    );
  }

  if (name === "volume") {
    return (
      <svg {...common}>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
      </svg>
    );
  }

  if (name === "mute") {
    return (
      <svg {...common}>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m16 10 5 5M21 10l-5 5" />
      </svg>
    );
  }

  if (name === "fullscreen") {
    return (
      <svg {...common}>
        <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
      </svg>
    );
  }

  return null;
}
