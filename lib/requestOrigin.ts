// Route-handler URLs may use an internal hostname. The browser-facing Host
// header remains the authority for same-origin requests behind the adapter.
export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const source = new URL(origin);
    const destination = new URL(request.url);
    const host = (request.headers.get("host") || destination.host).toLowerCase();
    return source.origin === origin && source.host === host && source.protocol === destination.protocol;
  } catch {
    return false;
  }
}
