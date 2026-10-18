const CACHE_NAME = "vistiq-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// Deliberately does not cache pages, API responses, or Supabase requests -
// this app is auth/RLS/payment-status driven, so anything dynamic must
// always come from the network. The only job of this worker is to satisfy
// PWA installability and show a friendly page instead of the browser's
// default error when a navigation happens with no connection.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});

// Push is delivered by the browser service even when no Vistiq tab is open.
self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { /* Always show a visible notification. */ }
  const url = typeof payload.url === "string" && /^\/(admin|reseller)(\/|$)/.test(payload.url) ? payload.url : "/login";
  event.waitUntil(self.registration.showNotification(typeof payload.title === "string" ? payload.title : "Notifikasi baru", {
    body: typeof payload.body === "string" ? payload.body : "Ada pemberitahuan baru. Buka dashboard untuk melihatnya.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: typeof payload.tag === "string" ? payload.tag : "dashboard-notification",
    data: { url },
    vibrate: [150, 80, 150],
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = event.notification.data?.url;
  const safePath = typeof path === "string" && /^\/(admin|reseller)(\/|$)/.test(path) ? path : "/login";
  const target = new URL(safePath, self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) { await existing.navigate(target); return existing.focus(); }
    return self.clients.openWindow(target);
  }));
});
