"use client";

import Reveal from "@/components/Reveal";
import { useRsvpWishes } from "@/hooks/useRsvpWishes";
import type { AqiqahInvitationData } from "@/types/aqiqah";
import styles from "./style.module.css";

export default function Wishes({ invitation }: { invitation: AqiqahInvitationData }) {
  const { entries, hasMore, loadMore, totalCount } = useRsvpWishes(invitation.id);

  return (
    <div className={styles.section}>
      <Reveal>
        <p className={styles.eyebrow}>Doa &amp; Harapan</p>
        <h2 className={styles.title}>Ucapan &amp; Doa</h2>
      </Reveal>

      {totalCount === 0 ? (
        <p className={styles.wishEmpty}>
          Jadilah yang pertama mengirimkan ucapan dan doa.
        </p>
      ) : (
        <>
          <div className={styles.wishesList}>
            {entries.map((entry, index) => (
              <Reveal key={entry.id} delay={Math.min(index * 0.05, 0.3)}>
                <div className={styles.wishCard}>
                  <div className={styles.wishHeader}>
                    <span className={styles.wishName}>{entry.name}</span>
                    <span className={styles.wishAttendance}>
                      {entry.attendance}
                    </span>
                  </div>

                  <p className={styles.wishMessage}>{entry.message}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMore} onClick={loadMore}>
              Muat Lebih Banyak
            </button>
          )}
        </>
      )}
    </div>
  );
}
