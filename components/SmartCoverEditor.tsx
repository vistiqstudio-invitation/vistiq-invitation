"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SMART_COVER,
  type SmartCoverConfig,
  type SmartCoverTextPosition,
  parseSmartCoverValue,
  serializeSmartCoverValue,
} from "@/lib/smartCover";
import styles from "./SmartCoverEditor.module.css";

type Viewport = "desktop" | "mobile";

type FaceDetectorResult = {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type FaceDetectorInstance = {
  detect: (source: HTMLImageElement) => Promise<FaceDetectorResult[]>;
};

type FaceDetectorConstructor = new (options?: {
  fastMode?: boolean;
  maxDetectedFaces?: number;
}) => FaceDetectorInstance;

type Props = {
  value: string;
  onChange: (value: string) => void;
  names?: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Foto tidak dapat dibaca."));
    image.src = source;
  });
}

function overlayGradient(
  position: SmartCoverTextPosition,
  overlay: number
) {
  const alpha = Math.min(0.72, Math.max(0, overlay / 100));
  const solid = `rgba(0, 0, 0, ${alpha})`;
  const soft = `rgba(0, 0, 0, ${alpha * 0.45})`;

  if (position === "left") {
    return `linear-gradient(90deg, ${solid} 0%, ${soft} 42%, transparent 76%)`;
  }

  if (position === "right") {
    return `linear-gradient(270deg, ${solid} 0%, ${soft} 42%, transparent 76%)`;
  }

  if (position === "top") {
    return `linear-gradient(180deg, ${solid} 0%, ${soft} 38%, transparent 72%)`;
  }

  if (position === "bottom") {
    return `linear-gradient(0deg, ${solid} 0%, ${soft} 38%, transparent 72%)`;
  }

  return `rgba(0, 0, 0, ${alpha * 0.72})`;
}

export default function SmartCoverEditor({ value, onChange, names }: Props) {
  const parsed = useMemo(() => parseSmartCoverValue(value), [value]);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState(
    parsed.configured
      ? "Smart Cover aktif."
      : "Tekan Atur Otomatis untuk mengaktifkan."
  );

  if (!parsed.source) return null;

  const config = parsed.config;
  const current = config[viewport];

  const commit = (next: SmartCoverConfig) => {
    onChange(serializeSmartCoverValue(parsed.source, next));
  };

  const updateCurrent = (
    patch: Partial<SmartCoverConfig[typeof viewport]>
  ) => {
    commit({
      ...config,
      enabled: true,
      [viewport]: {
        ...current,
        ...patch,
      },
    });
    setMessage("Pengaturan berubah. Klik Simpan Perubahan di bawah.");
  };

  const setFocusFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const focalX = clamp(((event.clientX - bounds.left) / bounds.width) * 100);
    const focalY = clamp(((event.clientY - bounds.top) / bounds.height) * 100);
    updateCurrent({ focalX, focalY });
  };

  const autoArrange = async () => {
    setDetecting(true);
    setMessage("Mendeteksi posisi wajah...");

    try {
      const image = await loadImage(parsed.source);
      const detectorConstructor = (
        window as typeof window & { FaceDetector?: FaceDetectorConstructor }
      ).FaceDetector;

      let faceCenterX = 64;
      let faceCenterY = 52;
      let detected = false;

      if (detectorConstructor) {
        const detector = new detectorConstructor({
          fastMode: true,
          maxDetectedFaces: 6,
        });
        const faces = await detector.detect(image);

        if (faces.length > 0) {
          const left = Math.min(...faces.map((face) => face.boundingBox.x));
          const top = Math.min(...faces.map((face) => face.boundingBox.y));
          const right = Math.max(
            ...faces.map(
              (face) => face.boundingBox.x + face.boundingBox.width
            )
          );
          const bottom = Math.max(
            ...faces.map(
              (face) => face.boundingBox.y + face.boundingBox.height
            )
          );

          faceCenterX = ((left + right) / 2 / image.naturalWidth) * 100;
          faceCenterY = ((top + bottom) / 2 / image.naturalHeight) * 100;
          detected = true;
        }
      }

      const desktopText =
        faceCenterX >= 56 ? "left" : faceCenterX <= 44 ? "right" : "left";

      const next: SmartCoverConfig = {
        ...DEFAULT_SMART_COVER,
        enabled: true,
        desktop: {
          focalX: clamp(faceCenterX, 18, 82),
          focalY: clamp(faceCenterY, 22, 78),
          textPosition: desktopText,
          overlay: 32,
        },
        mobile: {
          focalX: clamp(faceCenterX, 20, 80),
          focalY: clamp(faceCenterY + 12, 34, 82),
          textPosition: "top",
          overlay: 34,
        },
      };

      commit(next);
      setMessage(
        detected
          ? "Wajah terdeteksi. Posisi desktop dan HP sudah diatur."
          : "Safe area standar diterapkan. Geser titik fokus bila diperlukan."
      );
    } catch {
      commit(DEFAULT_SMART_COVER);
      setMessage(
        "Safe area standar diterapkan. Geser titik fokus bila diperlukan."
      );
    } finally {
      setDetecting(false);
    }
  };

  const disable = () => {
    onChange(parsed.source);
    setMessage("Smart Cover dinonaktifkan.");
  };

  const positionOptions =
    viewport === "desktop"
      ? [
          ["left", "Teks di kiri"],
          ["center", "Teks di tengah"],
          ["right", "Teks di kanan"],
        ]
      : [
          ["top", "Teks di atas"],
          ["center", "Teks di tengah"],
          ["bottom", "Teks di bawah"],
        ];

  const sampleClass =
    current.textPosition === "left"
      ? styles.sampleLeft
      : current.textPosition === "right"
      ? styles.sampleRight
      : current.textPosition === "top"
      ? styles.sampleTop
      : current.textPosition === "bottom"
      ? styles.sampleBottom
      : styles.sampleCenter;

  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <div>
          <h3>Atur Posisi Cover</h3>
          <p>
            Sistem menjaga wajah, nama, dan tanggal tetap terbaca pada desktop
            maupun HP.
          </p>
        </div>
        <span className={styles.status}>
          {parsed.configured ? "Aktif" : "Belum diatur"}
        </span>
      </div>

      <div className={styles.tabs}>
        {(["desktop", "mobile"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.tab} ${
              viewport === item ? styles.tabActive : ""
            }`}
            onClick={() => setViewport(item)}
          >
            {item === "desktop" ? "Desktop" : "HP"}
          </button>
        ))}
      </div>

      <div className={styles.workspace}>
        <div className={styles.previewWrap}>
          <div
            className={`${styles.preview} ${
              viewport === "mobile" ? styles.previewMobile : ""
            }`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setFocusFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                setFocusFromPointer(event);
              }
            }}
            aria-label="Geser titik fokus foto cover"
          >
            <img
              src={parsed.source}
              alt=""
              style={{
                objectPosition: `${current.focalX}% ${current.focalY}%`,
              }}
            />
            <div
              className={styles.overlay}
              style={{
                background: overlayGradient(
                  current.textPosition,
                  current.overlay
                ),
              }}
            />
            <div className={`${styles.sampleText} ${sampleClass}`}>
              <small>The Wedding of</small>
              <strong>{names || "Nama Pengantin"}</strong>
            </div>
            <span
              className={styles.focus}
              style={{
                left: `${current.focalX}%`,
                top: `${current.focalY}%`,
              }}
            />
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={autoArrange}
              disabled={detecting}
            >
              {detecting ? "Mendeteksi..." : "Atur Otomatis"}
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={disable}
            >
              Nonaktifkan
            </button>
          </div>

          <label className={styles.label}>
            Posisi teks
            <select
              className={styles.select}
              value={current.textPosition}
              onChange={(event) =>
                updateCurrent({
                  textPosition: event.target
                    .value as SmartCoverTextPosition,
                })
              }
            >
              {positionOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            <span>
              <span>Posisi horizontal</span>
              <b>{current.focalX}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={current.focalX}
              onChange={(event) =>
                updateCurrent({ focalX: Number(event.target.value) })
              }
            />
          </label>

          <label className={styles.label}>
            <span>
              <span>Posisi vertikal</span>
              <b>{current.focalY}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={current.focalY}
              onChange={(event) =>
                updateCurrent({ focalY: Number(event.target.value) })
              }
            />
          </label>

          <label className={styles.label}>
            <span>
              <span>Lapisan agar teks terbaca</span>
              <b>{current.overlay}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="60"
              value={current.overlay}
              onChange={(event) =>
                updateCurrent({ overlay: Number(event.target.value) })
              }
            />
          </label>

          <p className={styles.hint}>
            {message} Anda juga dapat menggeser titik biru langsung pada foto.
          </p>
        </div>
      </div>
    </section>
  );
}
