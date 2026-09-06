const OPTIMIZED_LOCAL_IMAGE = /^(\/photos\/[^?#]+|\/themes\/luxury-gold\/[^?#]+)\.png(\?[^#]*)?(#.*)?$/i;

/**
 * Demo assets are checked into public/ so themes can render without a storage
 * round-trip. Keep the original files available, but serve the optimized WebP
 * copy for the demo. This keeps the theme artwork unchanged while cutting the
 * transfer size of the photo-heavy demo assets dramatically.
 */
export function optimizedDemoImage(source: string | null): string | null {
  if (!source) return source;

  return source.replace(OPTIMIZED_LOCAL_IMAGE, "$1.webp$2$3");
}

export function optimizedDemoImages(sources: readonly string[]): string[] {
  return sources.map((source) => optimizedDemoImage(source) || source);
}
