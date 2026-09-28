"use client";

import { useEffect, useState } from "react";

function getBusinessStatus() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const total = hour * 60 + minute;
  const weekdayOpen = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday || "");
  const open = weekdayOpen && total >= 9 * 60 && total < 17 * 60;

  return open;
}

export function BusinessStatus() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(getBusinessStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (open === null) return null;

  return (
    <span className={open ? "business-status is-open" : "business-status is-closed"}>
      <i />
      {open ? "Aberto agora" : "Fechado agora"}
    </span>
  );
}
