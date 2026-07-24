export type SmartCoverTextPosition =
  | "left"
  | "center"
  | "right"
  | "top"
  | "bottom";

export type SmartCoverViewport = {
  focalX: number;
  focalY: number;
  textPosition: SmartCoverTextPosition;
  overlay: number;
};

export type SmartCoverConfig = {
  version: 1;
  enabled: boolean;
  desktop: SmartCoverViewport;
  mobile: SmartCoverViewport;
};

const CONFIG_MARKER = "#vistiq-cover=";

export const DEFAULT_SMART_COVER: SmartCoverConfig = {
  version: 1,
  enabled: true,
  desktop: {
    focalX: 68,
    focalY: 50,
    textPosition: "left",
    overlay: 32,
  },
  mobile: {
    focalX: 50,
    focalY: 64,
    textPosition: "top",
    overlay: 34,
  },
};

function clamp(value: unknown, fallback: number, min = 0, max = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function isTextPosition(value: unknown): value is SmartCoverTextPosition {
  return (
    value === "left" ||
    value === "center" ||
    value === "right" ||
    value === "top" ||
    value === "bottom"
  );
}

function normalizeViewport(
  value: Partial<SmartCoverViewport> | undefined,
  fallback: SmartCoverViewport
): SmartCoverViewport {
  return {
    focalX: clamp(value?.focalX, fallback.focalX),
    focalY: clamp(value?.focalY, fallback.focalY),
    textPosition: isTextPosition(value?.textPosition)
      ? value.textPosition
      : fallback.textPosition,
    overlay: clamp(value?.overlay, fallback.overlay, 0, 60),
  };
}

export function normalizeSmartCoverConfig(
  value: Partial<SmartCoverConfig> | null | undefined
): SmartCoverConfig {
  return {
    version: 1,
    enabled: value?.enabled !== false,
    desktop: normalizeViewport(value?.desktop, DEFAULT_SMART_COVER.desktop),
    mobile: normalizeViewport(value?.mobile, DEFAULT_SMART_COVER.mobile),
  };
}

export function parseSmartCoverValue(value: string | null | undefined): {
  source: string;
  config: SmartCoverConfig;
  configured: boolean;
} {
  if (!value) {
    return {
      source: "",
      config: DEFAULT_SMART_COVER,
      configured: false,
    };
  }

  const markerIndex = value.indexOf(CONFIG_MARKER);
  if (markerIndex < 0) {
    return {
      source: value,
      config: DEFAULT_SMART_COVER,
      configured: false,
    };
  }

  const source = value.slice(0, markerIndex);
  const encoded = value.slice(markerIndex + CONFIG_MARKER.length);

  try {
    const parsed = JSON.parse(decodeURIComponent(encoded)) as Partial<SmartCoverConfig>;
    return {
      source,
      config: normalizeSmartCoverConfig(parsed),
      configured: true,
    };
  } catch {
    return {
      source,
      config: DEFAULT_SMART_COVER,
      configured: false,
    };
  }
}

export function serializeSmartCoverValue(
  sourceValue: string,
  config: SmartCoverConfig
) {
  const source = parseSmartCoverValue(sourceValue).source;
  if (!source) return "";

  const normalized = normalizeSmartCoverConfig(config);
  return `${source}${CONFIG_MARKER}${encodeURIComponent(
    JSON.stringify(normalized)
  )}`;
}

export function stripSmartCoverConfig(value: string | null | undefined) {
  return parseSmartCoverValue(value).source;
}
