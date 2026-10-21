"use client";

import { useEffect } from "react";
import type { InvitationData } from "@/types/invitation";
import AdatMinangMotionBase from "./AdatMinangMotionBase";
import styles from "./style.module.css";

/**
 * Compatibility wrapper for the Minang motion theme.
 *
 * The original visual implementation reads Love Story images from `gallery`.
 * New invitations store dedicated Love Story images in `storyPhotos`. Keep the
 * gallery untouched for the Gallery section while exposing the configured
 * story photos to the legacy Love Story renderer until the visual component is
 * fully migrated.
 */
export default function AdatMinangMotion({ invitation }: { invitation: InvitationData }) {
  const configuredStoryPhotos = (invitation.storyPhotos || []).filter(
    (photo): photo is string => Boolean(photo),
  );
  const isTarmiziBalqis = invitation.slug === "tarmizi-balqis";

  useEffect(() => {
    if (!isTarmiziBalqis) return;

    let cleanupSlider: (() => void) | null = null;

    const setupSlider = () => {
      const gallery = document.querySelector<HTMLElement>(`.${styles.referenceGallery}`);
      if (!gallery || gallery.dataset.tarmiziSlider === "true") return false;

      const wrap = gallery.parentElement;
      if (!wrap) return false;

      const tiles = Array.from(gallery.querySelectorAll<HTMLButtonElement>(`.${styles.galleryTile}`));
      if (tiles.length === 0) return false;

      gallery.dataset.tarmiziSlider = "true";
      let active = 0;

      gallery.style.display = "block";
      gallery.style.position = "relative";
      gallery.style.height = "min(128vw, 560px)";
      gallery.style.maxHeight = "560px";
      gallery.style.borderRadius = "18px";
      gallery.style.overflow = "hidden";
      gallery.style.background = "#fff";

      tiles.forEach((tile) => {
        tile.style.position = "absolute";
        tile.style.inset = "0";
        tile.style.width = "100%";
        tile.style.height = "100%";
        tile.style.border = "0";
        tile.style.background = "#fff";
        tile.style.padding = "0";
        const img = tile.querySelector<HTMLImageElement>("img");
        if (img) {
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          img.style.background = "#fff";
        }
      });

      const controls = document.createElement("div");
      controls.style.position = "absolute";
      controls.style.right = "14px";
      controls.style.bottom = "14px";
      controls.style.display = "flex";
      controls.style.gap = "8px";
      controls.style.zIndex = "5";

      const makeArrow = (label: string) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.style.width = "44px";
        button.style.height = "44px";
        button.style.borderRadius = "50%";
        button.style.border = "1px solid rgba(0,0,0,.08)";
        button.style.background = "rgba(255,255,255,.94)";
        button.style.color = "#666";
        button.style.fontSize = "25px";
        button.style.lineHeight = "1";
        button.style.boxShadow = "0 4px 14px rgba(0,0,0,.12)";
        return button;
      };

      const prev = makeArrow("‹");
      const next = makeArrow("›");
      controls.append(prev, next);
      gallery.appendChild(controls);

      const counter = document.createElement("div");
      counter.style.position = "absolute";
      counter.style.right = "14px";
      counter.style.bottom = "66px";
      counter.style.zIndex = "5";
      counter.style.padding = "7px 10px";
      counter.style.borderRadius = "4px";
      counter.style.background = "rgba(55,55,55,.68)";
      counter.style.color = "#fff";
      counter.style.fontSize = "12px";
      counter.style.letterSpacing = "1px";
      gallery.appendChild(counter);

      const thumbs = document.createElement("div");
      thumbs.style.display = "grid";
      thumbs.style.gridAutoFlow = "column";
      thumbs.style.gridAutoColumns = "86px";
      thumbs.style.gap = "8px";
      thumbs.style.marginTop = "12px";
      thumbs.style.padding = "2px";
      thumbs.style.overflowX = "auto";
      thumbs.style.scrollbarWidth = "none";

      const thumbButtons = tiles.map((tile, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.style.width = "86px";
        button.style.height = "104px";
        button.style.padding = "0";
        button.style.overflow = "hidden";
        button.style.background = "#fff";
        button.style.borderRadius = "2px";
        const source = tile.querySelector<HTMLImageElement>("img")?.src || "";
        const img = document.createElement("img");
        img.src = source;
        img.alt = `Thumbnail ${index + 1}`;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        button.appendChild(img);
        thumbs.appendChild(button);
        return button;
      });
      wrap.appendChild(thumbs);

      const render = () => {
        tiles.forEach((tile, index) => {
          tile.style.display = index === active ? "block" : "none";
        });
        thumbButtons.forEach((button, index) => {
          button.style.border = index === active ? "2px solid #777" : "2px solid transparent";
          button.style.opacity = index === active ? "1" : ".72";
        });
        counter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(tiles.length).padStart(2, "0")}`;
        thumbButtons[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      };

      const showPrevious = (event: Event) => {
        event.stopPropagation();
        active = (active - 1 + tiles.length) % tiles.length;
        render();
      };
      const showNext = (event: Event) => {
        event.stopPropagation();
        active = (active + 1) % tiles.length;
        render();
      };
      prev.addEventListener("click", showPrevious);
      next.addEventListener("click", showNext);
      thumbButtons.forEach((button, index) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          active = index;
          render();
        });
      });

      render();

      cleanupSlider = () => {
        prev.removeEventListener("click", showPrevious);
        next.removeEventListener("click", showNext);
        thumbs.remove();
        controls.remove();
        counter.remove();
        delete gallery.dataset.tarmiziSlider;
      };
      return true;
    };

    if (setupSlider()) return cleanupSlider || undefined;

    const observer = new MutationObserver(() => {
      if (setupSlider()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanupSlider?.();
    };
  }, [isTarmiziBalqis]);

  const sourceGallery = invitation.gallery;
  const galleryForTheme = [...sourceGallery];
  const nativeSlice = Array.prototype.slice.bind(sourceGallery) as (
    start?: number,
    end?: number,
  ) => string[];
  let storySliceCall = 0;

  galleryForTheme.slice = ((start?: number, end?: number) => {
    // Tarmizi & Balqis uses a reference-style slider. Return every uploaded
    // gallery image even though the legacy gallery asks for only six.
    if (isTarmiziBalqis && start === 0 && end === 6) {
      return nativeSlice(0);
    }

    // The legacy Love Story renderer calls slice(0, 4) twice: first for the
    // primary story images (then reverses them), and second for its fallback.
    // Return dedicated story images for those two calls only. Gallery rendering
    // uses slice(0, 6), so the actual gallery remains exactly as uploaded.
    if (configuredStoryPhotos.length > 0 && start === 0 && end === 4) {
      storySliceCall += 1;

      if (storySliceCall % 2 === 1) {
        return configuredStoryPhotos.slice(0, 4).reverse();
      }

      const fallback = nativeSlice(0, 4);
      if (configuredStoryPhotos[4]) fallback[4] = configuredStoryPhotos[4];
      return fallback;
    }

    return nativeSlice(start, end);
  }) as typeof galleryForTheme.slice;

  return (
    <AdatMinangMotionBase
      invitation={{
        ...invitation,
        gallery: galleryForTheme,
      }}
    />
  );
}