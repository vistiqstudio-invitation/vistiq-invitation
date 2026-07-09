import styles from "./PhoneMockup.module.css";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;
const BEZEL = 10;

type Props = {
  themeKey: string;
  /** Visible screen width in px (the phone body will be slightly larger to fit the bezel). */
  width?: number;
  className?: string;
  style?: React.CSSProperties;
};

// A phone-shaped frame with a live (non-interactive) iframe of the actual
// theme demo inside, scaled down to fit. Used anywhere we want to show real
// theme screens instead of a flat color placeholder - homepage hero, theme
// section, and the /demo picker cards.
export default function PhoneMockup({ themeKey, width = 220, className, style }: Props) {
  const scale = width / DESIGN_WIDTH;
  const screenHeight = DESIGN_HEIGHT * scale;

  return (
    <div
      className={`${styles.phone} ${className ?? ""}`}
      style={{ ...style, width: width + BEZEL * 2, padding: BEZEL }}
    >
      <div className={styles.notch} />
      <div className={styles.screen} style={{ width, height: screenHeight }}>
        <iframe
          src={`/demo/${themeKey}`}
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
        <div className={styles.tapShield} />
      </div>
    </div>
  );
}
