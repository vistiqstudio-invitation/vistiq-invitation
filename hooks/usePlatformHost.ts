"use client";

import { useSyncExternalStore } from "react";
import { isPlatformHostname } from "@/lib/customDomain";

const subscribe = () => () => undefined;

export function usePlatformHost() {
  return useSyncExternalStore(
    subscribe,
    () => isPlatformHostname(window.location.hostname),
    () => false
  );
}
