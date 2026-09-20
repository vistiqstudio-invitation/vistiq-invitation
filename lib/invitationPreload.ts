import type { InvitationData } from "@/types/invitation";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import type { KhitanInvitationData } from "@/types/khitan";
import type { BirthdayInvitationData } from "@/types/birthday";

export type PreloadInvitation = InvitationData | AqiqahInvitationData | KhitanInvitationData | BirthdayInvitationData;
export type PreloadAsset = { kind: "image" | "video" | "audio"; url: string };

function assetUrl(value?: string | null) {
  const url = value?.trim().split("#", 1)[0] || "";
  return /^(https?:\/\/|\/(?!\/)|data:image\/)/i.test(url) ? url : "";
}

export function invitationPreloadData(invitation: PreloadInvitation, theme: string) {
  const noPhoto = theme === "ivory-botanica";
  const people = invitation.category === "wedding"
    ? [invitation.groom, invitation.bride]
    : [invitation.category === "aqiqah" ? invitation.baby : invitation.child];
  const title = people.map(person => ("nickname" in person && person.nickname) || person.name).filter(Boolean).join(" & ");
  const image = noPhoto ? "" : assetUrl(invitation.coverImage);
  const assets: PreloadAsset[] = [];
  const seen = new Set<string>();
  const add = (kind: PreloadAsset["kind"], value?: string | null) => {
    const url = assetUrl(value);
    if (!url || seen.has(`${kind}:${url}`)) return;
    seen.add(`${kind}:${url}`);
    assets.push({ kind, url });
  };
  add("image", image);
  // External players (YouTube, maps, live streams) must never block entry.
  if (/\.(mp4|webm|m4v)(?:[?#]|$)/i.test(invitation.videoUrl || "")) add("video", invitation.videoUrl);
  if (!noPhoto) {
    people.forEach(person => add("image", person.photo));
    invitation.gallery.forEach(url => add("image", url));
  }
  if (/\.(mp3|m4a|aac|ogg|wav)(?:[?#]|$)/i.test(invitation.musicUrl || "")) add("audio", invitation.musicUrl);
  return { title, image, assets };
}

type PreloadOptions = {
  onProgress: (percent: number) => void;
  onComplete: () => void;
  timeoutMs?: number;
};

// Readiness is based on decoded images, loaded fonts and media buffering,
// not a timer counting towards a fictional 100%.
export function preloadInvitationAssets(assets: PreloadAsset[], options: PreloadOptions) {
  let stopped = false;
  let next = 0;
  let active = 0;
  let settled = 0;
  const progress = assets.map(() => 0);
  let fontsReady = 0;
  const cleanups = new Set<() => void>();
  const publish = () => {
    if (!stopped) options.onProgress(Math.floor((progress.reduce((sum, value) => sum + value, 0) + fontsReady) * 100 / (assets.length + 1)));
  };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(deadline);
    cleanups.forEach(cleanup => cleanup());
    cleanups.clear();
  };
  const complete = () => {
    if (stopped) return;
    stop();
    options.onComplete();
  };
  const deadline = window.setTimeout(complete, options.timeoutMs ?? 12000);
  const finish = (index: number, success: boolean) => {
    if (stopped) return;
    if (success) progress[index] = 1;
    settled += 1;
    active -= 1;
    publish();
    pump();
  };
  const start = (asset: PreloadAsset, index: number) => {
    let done = false;
    const loaded = (success: boolean) => {
      if (done || stopped) return;
      done = true;
      finish(index, success);
    };
    if (asset.kind === "image") {
      const image = new Image();
      image.decoding = "async";
      const cleanup = () => { image.onload = null; image.onerror = null; };
      cleanups.add(cleanup);
      image.onload = () => {
        const decoded = image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
        void decoded.then(() => loaded(true));
      };
      image.onerror = () => loaded(false);
      image.src = asset.url;
      if (image.complete && image.naturalWidth > 0) image.onload(new Event("load"));
      return;
    }
    const media = document.createElement(asset.kind);
    media.preload = "auto";
    media.muted = true;
    if (media instanceof HTMLVideoElement) media.playsInline = true;
    const update = () => {
      if (stopped || done || !Number.isFinite(media.duration) || media.duration <= 0) return;
      // Only a continuous buffer beginning at zero counts towards readiness.
      const end = media.buffered.length && media.buffered.start(0) < 0.1 ? media.buffered.end(0) : 0;
      progress[index] = Math.max(progress[index], Math.min(0.99, end / media.duration));
      publish();
      if (end >= media.duration - 0.1) loaded(true);
    };
    const playable = () => loaded(true);
    const error = () => loaded(false);
    media.addEventListener("progress", update);
    media.addEventListener("loadedmetadata", update);
    media.addEventListener("canplaythrough", playable);
    media.addEventListener("error", error);
    cleanups.add(() => {
      media.removeEventListener("progress", update);
      media.removeEventListener("loadedmetadata", update);
      media.removeEventListener("canplaythrough", playable);
      media.removeEventListener("error", error);
      // No playback is started by preloading; the cover keeps the user gesture.
      media.removeAttribute("src");
      media.load();
    });
    media.src = asset.url;
    media.load();
  };
  function pump() {
    if (stopped) return;
    // Keep network contention bounded, even for a large client gallery.
    while (active < 4 && next < assets.length) {
      const index = next++;
      active += 1;
      try { start(assets[index], index); } catch { finish(index, false); }
    }
    if (settled === assets.length && fontsReady) complete();
  }
  void (document.fonts?.ready || Promise.resolve()).then(() => {
    if (stopped) return;
    fontsReady = 1;
    publish();
    pump();
  }, () => { if (!stopped) complete(); });
  pump();
  return stop;
}
