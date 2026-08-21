import type { ReactNode } from "react";
import styles from "./WeddingThemeSafeArea.module.css";

export default function WeddingThemeSafeArea({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.root} data-wedding-theme={theme}>
      {children}
    </div>
  );
}
