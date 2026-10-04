"use client";

import { useEffect } from "react";

export default function TenantUrlCleaner() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("tenant-domain") !== "1") return;
    window.history.replaceState(window.history.state, "", "/");
  }, []);

  return null;
}
