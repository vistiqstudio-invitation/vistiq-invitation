"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSavedId() {
  return new URLSearchParams(window.location.search).get("saved");
}

export function useSavedInvitation(loading: boolean) {
  const savedId = useSyncExternalStore(subscribe, getSavedId, () => null);

  useEffect(() => {
    if (!loading && savedId) {
      document.getElementById(`saved-invitation-${savedId}`)?.scrollIntoView({
        block: "center",
      });
    }
  }, [loading, savedId]);

  return savedId;
}
