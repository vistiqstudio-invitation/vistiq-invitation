import type { ReactNode } from "react";
import type { InvitationData } from "@/types/invitation";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import type { KhitanInvitationData } from "@/types/khitan";
import type { BirthdayInvitationData } from "@/types/birthday";
import styles from "./WeddingThemeSafeArea.module.css";

type InvitationFrameData =
  | InvitationData
  | AqiqahInvitationData
  | KhitanInvitationData
  | BirthdayInvitationData;

function personName(person: { name: string; nickname?: string | null }) {
  return person.nickname || person.name;
}

function frameTitle(invitation?: InvitationFrameData) {
  if (!invitation) return "";

  if (invitation.category === "wedding") {
    return [personName(invitation.bride), personName(invitation.groom)]
      .filter(Boolean)
      .join(" & ");
  }

  return invitation.category === "aqiqah"
    ? invitation.baby.name
    : invitation.child.name;
}

function frameEyebrow(invitation?: InvitationFrameData) {
  if (!invitation) return "The Wedding of";
  if (invitation.category === "wedding") return "The Wedding of";
  if (invitation.category === "aqiqah") return "Aqiqah";
  if (invitation.category === "khitan") return "Khitan";
  return "Birthday Celebration";
}

function frameDate(invitation?: InvitationFrameData) {
  if (!invitation) return "";

  if (invitation.category === "wedding") {
    return invitation.events[0]?.date || "";
  }

  if (invitation.category === "aqiqah") {
    return invitation.event?.date || invitation.baby.birthDate || "";
  }

  return invitation.event?.date || invitation.child.birthDate || "";
}

function isLavenderMotionTheme(theme: string) {
  return [
    "lavender-garden-motion",
    "3d-montion-2",
    "3d-motion-2",
    "premium-3d-motion",
  ].includes(theme);
}

function frameImage(invitation: InvitationFrameData | undefined, theme: string) {
  if (isLavenderMotionTheme(theme) && invitation?.category === "wedding") {
    const bridePhoto = invitation.bride.photo?.split("#", 1)[0];
    if (bridePhoto) return bridePhoto;
  }

  const configured = invitation?.coverImage?.split("#", 1)[0];
  return configured || "/themes/luxury-gold/cover.png";
}

export default function WeddingThemeSafeArea({
  theme,
  invitation,
  children,
}: {
  theme: string;
  invitation?: InvitationFrameData;
  children: ReactNode;
}) {
  const title = frameTitle(invitation);
  const date = frameDate(invitation);
  const lavenderMotion = isLavenderMotionTheme(theme);
  const weddingInvitation = invitation?.category === "wedding" ? invitation : null;

  return (
    <div className={styles.root} data-wedding-theme={theme}>
      <div className={styles.desktopBackdrop} aria-hidden="true">
        {lavenderMotion && weddingInvitation ? (
          <div className={styles.desktopBackdropPortraitPair}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${styles.desktopBackdropPortrait} ${styles.desktopBackdropPortraitBride}`}
              src={weddingInvitation.bride.photo || "/themes/premium-3d-motion-2/naya-farhan-bride.jpg"}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${styles.desktopBackdropPortrait} ${styles.desktopBackdropPortraitGroom}`}
              src={weddingInvitation.groom.photo || "/themes/premium-3d-motion-2/naya-farhan-groom.jpg"}
              alt=""
            />
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frameImage(invitation, theme)} alt="" />
          </>
        )}
        {lavenderMotion && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${styles.desktopBackdropFloral} ${styles.desktopBackdropFloralLeft}`}
              src="/themes/premium-3d-motion-2/Garden-02-Couple-1.png.webp"
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`${styles.desktopBackdropFloral} ${styles.desktopBackdropFloralRight}`}
              src="/themes/premium-3d-motion-2/Garden-02-Couple-2.png.webp"
              alt=""
            />
          </>
        )}
        <div className={styles.desktopBackdropShade} />
        {title && (
          <div className={styles.desktopBackdropCopy}>
            <p>{frameEyebrow(invitation)}</p>
            <h1>{title}</h1>
            {date && <span>{date}</span>}
          </div>
        )}
      </div>
      <div className={styles.stage}>{children}</div>
    </div>
  );
}
