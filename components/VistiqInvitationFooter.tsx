import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./VistiqInvitationFooter.module.css";

const adminPhone = "6281371338032";
const message = "saya mau order undangan, berapa biayanya ?";

export default function VistiqInvitationFooter() {
  return (
    <footer className={styles.footer}>
      <a
        href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`}
        aria-label="Vistiq Invitation, tanya biaya undangan melalui WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsapp}
      >
        <WhatsAppIcon size={16} className={styles.icon} />
        <strong>Vistiq Invitation</strong>
      </a>
    </footer>
  );
}
