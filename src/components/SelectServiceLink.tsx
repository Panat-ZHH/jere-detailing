"use client";

import type { ReactNode } from "react";
import type { VehicleSize } from "@/lib/booking";

export const SELECT_SERVICE_EVENT = "jj:select-service";
export type SelectServiceDetail = { service: string; size?: VehicleSize };

// Wählt das Paket im Anfrageformular vor und springt dorthin.
export function SelectServiceLink({
  service,
  className,
  children,
}: {
  service: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#anfrage"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent<SelectServiceDetail>(SELECT_SERVICE_EVENT, { detail: { service } }))
      }
    >
      {children}
    </a>
  );
}
