import styles from "./PhoneMockup.module.css";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const DESIGN_BEZEL = 5;
const OUTER_RADIUS = 52;
const SCREEN_RADIUS = 42;
const ISLAND_WIDTH = 96;
const ISLAND_HEIGHT = 28;
const ISLAND_TOP = 14;
const HOME_BAR_WIDTH = 120;
const HOME_BAR_HEIGHT = 5;

type Props = {
  themeKey: string;
  /** Visible screen width in px (the phone body will be slightly larger to fit the bezel). */
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Base demo route the iframe points at - "/demo" for wedding themes, "/demo-akikah" for aqiqah themes. */
  demoPath?: string;
};

// A phone-shaped frame with a live (non-interactive) iframe of the actual
// theme demo inside, scaled down to fit. Used anywhere we want to show real
// theme screens instead of a flat color placeholder - homepage hero, theme
// section, and the /demo picker cards.
export default function PhoneMockup({ themeKey, width = 220, className, style, demoPath = "/demo" }: Props) {
  const scale = width / DESIGN_WIDTH;
  const screenHeight = DESIGN_HEIGHT * scale;
  const outerRadius = OUTER_RADIUS * scale;
  const screenRadius = SCREEN_RADIUS * scale;
  const buttonRadius = 2.5 * scale;
  const bezel = Math.max(DESIGN_BEZEL * scale, 1.5);

  return (
    <div
      className={`${styles.phone} ${className ?? ""}`}
      style={{ ...style, width: width + bezel * 2, padding: bezel, borderRadius: outerRadius }}
    >
      <div className={styles.edgeHighlight} style={{ borderRadius: outerRadius }} />

      <div
        className={styles.buttonMute}
        style={{ top: 92 * scale, width: 3 * scale, height: 26 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonVolUp}
        style={{ top: 130 * scale, width: 3 * scale, height: 44 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonVolDown}
        style={{ top: 182 * scale, width: 3 * scale, height: 44 * scale, borderRadius: buttonRadius }}
      />
      <div
        className={styles.buttonPower}
        style={{ top: 148 * scale, width: 3 * scale, height: 66 * scale, borderRadius: buttonRadius }}
      />

      <div className={styles.screen} style={{ width, height: screenHeight, borderRadius: screenRadius }}>
        <iframe
          src={`${demoPath}/${themeKey}`}
          className={styles.frame}
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
          tabIndex={-1}
          aria-hidden="true"
          loading="lazy"
          scrolling="no"
        />

        <div className={styles.screenGloss} />

        <div
          className={styles.island}
          style={{
            top: ISLAND_TOP * scale,
            width: ISLAND_WIDTH * scale,
            height: ISLAND_HEIGHT * scale,
            borderRadius: (ISLAND_HEIGHT / 2) * scale,
          }}
        />

        <div
          className={styles.homeBar}
          style={{
            width: HOME_BAR_WIDTH * scale,
            height: HOME_BAR_HEIGHT * scale,
            borderRadius: (HOME_BAR_HEIGHT / 2) * scale,
            bottom: 6 * scale,
          }}
        />

        <div className={styles.tapShield} />
      </div>
    </div>
  );
}
