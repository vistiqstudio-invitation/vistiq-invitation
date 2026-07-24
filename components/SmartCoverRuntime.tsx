"use client";

import { type ReactNode, useEffect, useRef } from "react";
import {
  type SmartCoverTextPosition,
  parseSmartCoverValue,
} from "@/lib/smartCover";

type Props = {
  coverImage: string | null;
  title?: string;
  children: ReactNode;
};

function absoluteUrl(value: string) {
  try {
    return new URL(value, document.baseURI).href.split("#")[0];
  } catch {
    return value.split("#")[0];
  }
}

function colorIsDark(value: string) {
  const match = value.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!match) return false;

  const [, red, green, blue] = match.map(Number);
  const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
  return luminance < 138;
}

function gradientFor(
  position: SmartCoverTextPosition,
  overlay: number,
  lightOverlay: boolean
) {
  const channel = lightOverlay ? "255, 255, 255" : "0, 0, 0";
  const alpha = Math.min(0.72, Math.max(0, overlay / 100));
  const solid = `rgba(${channel}, ${alpha})`;
  const soft = `rgba(${channel}, ${alpha * 0.42})`;

  if (position === "left") {
    return `linear-gradient(90deg, ${solid} 0%, ${soft} 43%, transparent 76%)`;
  }
  if (position === "right") {
    return `linear-gradient(270deg, ${solid} 0%, ${soft} 43%, transparent 76%)`;
  }
  if (position === "top") {
    return `linear-gradient(180deg, ${solid} 0%, ${soft} 40%, transparent 73%)`;
  }
  if (position === "bottom") {
    return `linear-gradient(0deg, ${solid} 0%, ${soft} 40%, transparent 73%)`;
  }
  return `rgba(${channel}, ${alpha * 0.7})`;
}

function findCoverHost(image: HTMLImageElement, root: HTMLElement) {
  let current = image.parentElement;
  let best = current;

  for (let depth = 0; current && current !== root && depth < 7; depth += 1) {
    const bounds = current.getBoundingClientRect();
    if (
      bounds.width >= Math.min(window.innerWidth * 0.72, 720) &&
      bounds.height >= Math.min(window.innerHeight * 0.62, 620) &&
      bounds.top < 180
    ) {
      best = current;
    }
    current = current.parentElement;
  }

  return best ?? image.parentElement ?? root;
}

function findTextRoot(host: HTMLElement, title?: string) {
  const headings = Array.from(
    host.querySelectorAll<HTMLElement>("h1, h2, h3")
  );
  if (headings.length === 0) return null;

  const tokens = (title ?? "")
    .toLowerCase()
    .split(/&|dan|\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  const heading =
    headings
      .map((item) => {
        const text = item.textContent?.toLowerCase() ?? "";
        const tokenScore = tokens.filter((token) => text.includes(token)).length;
        const symbolScore = text.includes("&") ? 2 : 0;
        return { item, score: tokenScore * 4 + symbolScore };
      })
      .sort((a, b) => b.score - a.score)[0]?.item ?? headings[0];

  let current: HTMLElement = heading;
  while (
    current.parentElement &&
    current.parentElement !== host &&
    !current.parentElement.querySelector("img")
  ) {
    const parentBounds = current.parentElement.getBoundingClientRect();
    const hostBounds = host.getBoundingClientRect();
    if (
      parentBounds.width > hostBounds.width * 0.72 ||
      parentBounds.height > hostBounds.height * 0.72
    ) {
      break;
    }
    current = current.parentElement;
  }

  return current;
}

function applyTextPosition(
  textRoot: HTMLElement,
  position: SmartCoverTextPosition,
  mobile: boolean
) {
  textRoot.style.setProperty("position", "absolute", "important");
  textRoot.style.setProperty("z-index", "3", "important");
  textRoot.style.setProperty("margin", "0", "important");

  if (mobile) {
    textRoot.style.setProperty("right", "8%", "important");
    textRoot.style.setProperty("left", "8%", "important");
    textRoot.style.setProperty("width", "auto", "important");
    textRoot.style.setProperty("max-width", "none", "important");
    textRoot.style.setProperty("text-align", "center", "important");

    if (position === "bottom") {
      textRoot.style.setProperty("top", "auto", "important");
      textRoot.style.setProperty("bottom", "10%", "important");
      textRoot.style.setProperty("transform", "none", "important");
    } else if (position === "center") {
      textRoot.style.setProperty("top", "50%", "important");
      textRoot.style.setProperty("bottom", "auto", "important");
      textRoot.style.setProperty(
        "transform",
        "translateY(-50%)",
        "important"
      );
    } else {
      textRoot.style.setProperty("top", "10%", "important");
      textRoot.style.setProperty("bottom", "auto", "important");
      textRoot.style.setProperty("transform", "none", "important");
    }
    return;
  }

  textRoot.style.setProperty("top", "50%", "important");
  textRoot.style.setProperty("bottom", "auto", "important");
  textRoot.style.setProperty("width", "min(42%, 560px)", "important");
  textRoot.style.setProperty("max-width", "560px", "important");
  textRoot.style.setProperty("transform", "translateY(-50%)", "important");

  if (position === "right") {
    textRoot.style.setProperty("right", "6%", "important");
    textRoot.style.setProperty("left", "auto", "important");
    textRoot.style.setProperty("text-align", "right", "important");
  } else if (position === "center") {
    textRoot.style.setProperty("right", "auto", "important");
    textRoot.style.setProperty("left", "50%", "important");
    textRoot.style.setProperty(
      "transform",
      "translate(-50%, -50%)",
      "important"
    );
    textRoot.style.setProperty("text-align", "center", "important");
  } else {
    textRoot.style.setProperty("right", "auto", "important");
    textRoot.style.setProperty("left", "6%", "important");
    textRoot.style.setProperty("text-align", "left", "important");
  }
}

export default function SmartCoverRuntime({
  coverImage,
  title,
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const parsed = parseSmartCoverValue(coverImage);
    if (!root || !parsed.source || !parsed.configured || !parsed.config.enabled) {
      return;
    }

    let restoreCurrent: (() => void) | undefined;

    const apply = () => {
      restoreCurrent?.();

      const expected = absoluteUrl(parsed.source);
      const candidates = Array.from(root.querySelectorAll("img")).filter(
        (item): item is HTMLImageElement =>
          item instanceof HTMLImageElement &&
          absoluteUrl(item.currentSrc || item.src) === expected
      );
      const image = candidates.sort((a, b) => {
        const areaA = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
        const areaB = b.getBoundingClientRect().width * b.getBoundingClientRect().height;
        return areaB - areaA;
      })[0];

      if (!image) return;

      const host = findCoverHost(image, root);
      const textRoot = findTextRoot(host, title);
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const settings = mobile
        ? parsed.config.mobile
        : parsed.config.desktop;

      const imageCss = image.style.cssText;
      const hostCss = host.style.cssText;
      const textCss = textRoot?.style.cssText;
      const hostPosition = window.getComputedStyle(host).position;

      image.style.setProperty(
        "object-position",
        `${settings.focalX}% ${settings.focalY}%`,
        "important"
      );
      image.style.setProperty("object-fit", "cover", "important");

      if (hostPosition === "static") {
        host.style.setProperty("position", "relative");
      }

      const overlay = document.createElement("span");
      overlay.dataset.vistiqSmartCoverOverlay = "true";
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.cssText =
        "position:absolute;inset:0;z-index:2;pointer-events:none;";

      const heading = textRoot?.querySelector<HTMLElement>("h1, h2, h3") ??
        (textRoot?.matches("h1, h2, h3") ? textRoot : null);
      const lightOverlay = heading
        ? colorIsDark(window.getComputedStyle(heading).color)
        : false;
      overlay.style.background = gradientFor(
        settings.textPosition,
        settings.overlay,
        lightOverlay
      );
      host.appendChild(overlay);

      if (textRoot) {
        applyTextPosition(textRoot, settings.textPosition, mobile);
      }

      restoreCurrent = () => {
        image.style.cssText = imageCss;
        host.style.cssText = hostCss;
        if (textRoot && textCss !== undefined) textRoot.style.cssText = textCss;
        overlay.remove();
      };
    };

    const timer = window.setTimeout(apply, 80);
    const observer = new ResizeObserver(apply);
    observer.observe(root);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      restoreCurrent?.();
    };
  }, [coverImage, title]);

  return <div ref={rootRef}>{children}</div>;
}
