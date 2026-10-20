"use client";

import type { ReactNode } from "react";
import type { ServiceId } from "@/lib/booking";

export const SELECT_SERVICE_EVENT = "jj:select-service";

// Wählt das Paket im Buchungsformular vor und springt dorthin.
export function SelectServiceLink({
  service,
  className,
  children,
}: {
  service: ServiceId;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#termin"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service }))}
    >
      {children}
    </a>
  );
}
